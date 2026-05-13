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

// ----- Import via API gratuite (admin) -----------------------------------

const CANONICAL_BOOKS = [
  ["genesis", "Genèse", 50], ["exodus", "Exode", 40], ["leviticus", "Lévitique", 27],
  ["numbers", "Nombres", 36], ["deuteronomy", "Deutéronome", 34], ["joshua", "Josué", 24],
  ["judges", "Juges", 21], ["ruth", "Ruth", 4], ["1 samuel", "1 Samuel", 31],
  ["2 samuel", "2 Samuel", 24], ["1 kings", "1 Rois", 22], ["2 kings", "2 Rois", 25],
  ["1 chronicles", "1 Chroniques", 29], ["2 chronicles", "2 Chroniques", 36],
  ["ezra", "Esdras", 10], ["nehemiah", "Néhémie", 13], ["esther", "Esther", 10],
  ["job", "Job", 42], ["psalms", "Psaumes", 150], ["proverbs", "Proverbes", 31],
  ["ecclesiastes", "Ecclésiaste", 12], ["song of solomon", "Cantique des Cantiques", 8],
  ["isaiah", "Ésaïe", 66], ["jeremiah", "Jérémie", 52], ["lamentations", "Lamentations", 5],
  ["ezekiel", "Ézéchiel", 48], ["daniel", "Daniel", 12], ["hosea", "Osée", 14],
  ["joel", "Joël", 3], ["amos", "Amos", 9], ["obadiah", "Abdias", 1],
  ["jonah", "Jonas", 4], ["micah", "Michée", 7], ["nahum", "Nahum", 3],
  ["habakkuk", "Habacuc", 3], ["zephaniah", "Sophonie", 3], ["haggai", "Aggée", 2],
  ["zechariah", "Zacharie", 14], ["malachi", "Malachie", 4],
  ["matthew", "Matthieu", 28], ["mark", "Marc", 16], ["luke", "Luc", 24],
  ["john", "Jean", 21], ["acts", "Actes", 28], ["romans", "Romains", 16],
  ["1 corinthians", "1 Corinthiens", 16], ["2 corinthians", "2 Corinthiens", 13],
  ["galatians", "Galates", 6], ["ephesians", "Éphésiens", 6],
  ["philippians", "Philippiens", 4], ["colossians", "Colossiens", 4],
  ["1 thessalonians", "1 Thessaloniciens", 5], ["2 thessalonians", "2 Thessaloniciens", 3],
  ["1 timothy", "1 Timothée", 6], ["2 timothy", "2 Timothée", 4],
  ["titus", "Tite", 3], ["philemon", "Philémon", 1], ["hebrews", "Hébreux", 13],
  ["james", "Jacques", 5], ["1 peter", "1 Pierre", 5], ["2 peter", "2 Pierre", 3],
  ["1 john", "1 Jean", 5], ["2 john", "2 Jean", 1], ["3 john", "3 Jean", 1],
  ["jude", "Jude", 1], ["revelation", "Apocalypse", 22],
];

async function fetchFromBibleApi(translation) {
  const verses = [];
  for (const [slug, name, chapters] of CANONICAL_BOOKS) {
    for (let ch = 1; ch <= chapters; ch++) {
      const url = `https://bible-api.com/${encodeURIComponent(slug)}+${ch}?translation=${translation}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`bible-api.com ${slug} ${ch} → ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      for (const v of data.verses ?? []) {
        verses.push({ book: name, chapter: Number(v.chapter), verse: Number(v.verse), text: String(v.text).trim() });
      }
    }
  }
  return { code: translation.toUpperCase().slice(0, 8), name: translation, language: "xx", verses };
}

async function fetchFromGetBible(translation) {
  const res = await fetch(`https://api.getbible.net/v2/${encodeURIComponent(translation)}.json`);
  if (!res.ok) throw new Error(`getbible.net ${translation} → ${res.status}`);
  const data = await res.json();
  const booksArr = Array.isArray(data.books) ? data.books : Object.values(data.books ?? {});
  const verses = [];
  for (const book of booksArr) {
    const bookName = book.name ?? `Livre ${book.nr}`;
    const chapters = Array.isArray(book.chapters) ? book.chapters : Object.values(book.chapters ?? {});
    for (const ch of chapters) {
      const list = Array.isArray(ch.verses) ? ch.verses : Object.values(ch.verses ?? {});
      for (const v of list) {
        verses.push({ book: bookName, chapter: Number(ch.chapter), verse: Number(v.verse), text: String(v.text ?? "").trim() });
      }
    }
  }
  return {
    code: (data.abbreviation ?? translation).toUpperCase().slice(0, 8),
    name: data.translation ?? translation,
    language: (data.lang ?? "xx").toLowerCase().slice(0, 2),
    verses,
  };
}

// POST /api/bible/versions/import  (admin)
export const importVersionFromApi = asyncHandler(async (req, res) => {
  const { source, translation, code, name, language, description } = req.body;
  if (!source || !translation) {
    res.status(400);
    throw new Error("source et translation requis");
  }

  let fetched;
  try {
    fetched = source === "getbible"
      ? await fetchFromGetBible(translation)
      : await fetchFromBibleApi(translation);
  } catch (e) {
    res.status(502);
    throw new Error("Échec API: " + e.message);
  }

  if (!fetched.verses.length) {
    res.status(400);
    throw new Error("Aucun verset reçu de l'API");
  }

  const upperCode = String(code || fetched.code).toUpperCase();
  const version = await BibleVersion.findOneAndUpdate(
    { code: upperCode },
    {
      code: upperCode,
      name: name || fetched.name,
      language: (language || fetched.language).toLowerCase(),
      description,
      createdBy: req.user._id,
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  await Verse.deleteMany({ translation: upperCode });
  const docs = fetched.verses.map((v) => ({ ...v, translation: upperCode }));
  await Verse.insertMany(docs, { ordered: false });

  version.versesCount = docs.length;
  await version.save();

  res.status(201).json({ success: true, version });
});
