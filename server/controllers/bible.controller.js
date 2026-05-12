import asyncHandler from "express-async-handler";
import Verse from "../models/Verse.js";
import BibleVersion from "../models/BibleVersion.js";

// GET /api/bible/versions
export const listVersions = asyncHandler(async (_req, res) => {
  const versions = await BibleVersion.find().sort({ createdAt: -1 });
  res.json({ success: true, versions });
});

// GET /api/bible/:book/:chapter
export const getChapter = asyncHandler(async (req, res) => {
  const { book, chapter } = req.params;
  const { translation = "LSG" } = req.query;
  const verses = await Verse.find({ translation, book, chapter: Number(chapter) }).sort({ verse: 1 });
  res.json({ success: true, verses });
});

// GET /api/bible/search?q=
export const searchVerses = asyncHandler(async (req, res) => {
  const { q, translation = "LSG" } = req.query;
  if (!q) return res.json({ success: true, verses: [] });
  const verses = await Verse.find({ translation, $text: { $search: q } }).limit(50);
  res.json({ success: true, verses });
});

// GET /api/bible/daily
export const verseOfTheDay = asyncHandler(async (_req, res) => {
  const count = await Verse.countDocuments();
  if (!count) return res.json({ success: true, verse: null });
  const day = new Date().getUTCDate() + new Date().getUTCMonth() * 31;
  const skip = day % count;
  const verse = await Verse.findOne().skip(skip);
  res.json({ success: true, verse });
});

// ----- Admin only ---------------------------------------------------------

const TXT_LINE = /^([\p{L}\p{M}\d'’\-\s]+?)\s+(\d+):(\d+)\s+(.+)$/u;

const parseVerses = (raw) => {
  const trimmed = raw.trim();
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    const data = JSON.parse(trimmed);
    const arr = Array.isArray(data) ? data : data?.verses ?? [];
    return arr
      .map((v) => ({
        book: String(v.book ?? "").trim(),
        chapter: Number(v.chapter),
        verse: Number(v.verse),
        text: String(v.text ?? "").trim(),
      }))
      .filter((v) => v.book && v.chapter && v.verse && v.text);
  }
  const out = [];
  for (const line of trimmed.split(/\r?\n/)) {
    const m = line.match(TXT_LINE);
    if (!m) continue;
    out.push({
      book: m[1].trim(),
      chapter: Number(m[2]),
      verse: Number(m[3]),
      text: m[4].trim(),
    });
  }
  return out;
};

// POST /api/bible/versions   (admin)
export const createVersion = asyncHandler(async (req, res) => {
  const { code, name, language = "fr", description } = req.body;
  if (!code || !name) {
    res.status(400);
    throw new Error("Code et nom requis");
  }
  if (!req.file) {
    res.status(400);
    throw new Error("Fichier requis (.json ou .txt)");
  }

  const raw = req.file.buffer
    ? req.file.buffer.toString("utf8")
    : (await import("fs")).readFileSync(req.file.path, "utf8");

  let parsed;
  try {
    parsed = parseVerses(raw);
  } catch (e) {
    res.status(400);
    throw new Error("Fichier invalide : " + e.message);
  }
  if (!parsed.length) {
    res.status(400);
    throw new Error("Aucun verset détecté");
  }

  const upperCode = String(code).toUpperCase();
  const version = await BibleVersion.findOneAndUpdate(
    { code: upperCode },
    { code: upperCode, name, language, description, createdBy: req.user._id },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  // Bulk replace existing verses for this translation
  await Verse.deleteMany({ translation: upperCode });
  const docs = parsed.map((v) => ({ ...v, translation: upperCode }));
  await Verse.insertMany(docs, { ordered: false });

  version.versesCount = docs.length;
  await version.save();

  res.status(201).json({ success: true, version });
});

// DELETE /api/bible/versions/:id  (admin)
export const deleteVersion = asyncHandler(async (req, res) => {
  const v = await BibleVersion.findById(req.params.id);
  if (!v) {
    res.status(404);
    throw new Error("Version introuvable");
  }
  await Verse.deleteMany({ translation: v.code });
  await v.deleteOne();
  res.json({ success: true });
});
