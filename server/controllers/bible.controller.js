import asyncHandler from "express-async-handler";
import Verse from "../models/Verse.js";

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
