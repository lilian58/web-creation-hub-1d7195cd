import asyncHandler from "express-async-handler";
import Book from "../models/Book.js";

export const listBooks = asyncHandler(async (req, res) => {
  const { q, category } = req.query;
  const filter = { status: "published" };
  if (category) filter.category = category;
  if (q) filter.$text = { $search: q };
  const items = await Book.find(filter)
    .populate("author", "name avatar")
    .sort({ createdAt: -1 })
    .limit(100);
  res.json({ success: true, items });
});

export const getBook = asyncHandler(async (req, res) => {
  const item = await Book.findById(req.params.id).populate("author", "name avatar");
  if (!item) {
    res.status(404);
    throw new Error("Livre introuvable");
  }
  res.json({ success: true, item });
});

export const createBook = asyncHandler(async (req, res) => {
  const fileUrl = req.body.fileUrl || (req.file ? `/uploads/${req.file.filename}` : null);
  if (!fileUrl) {
    res.status(400);
    throw new Error("Fichier requis");
  }
  const item = await Book.create({
    ...req.body,
    fileUrl,
    author: req.user._id,
    authorName: req.body.authorName || req.user.name,
  });
  res.status(201).json({ success: true, item });
});

export const updateBook = asyncHandler(async (req, res) => {
  const item = await Book.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Introuvable");
  }
  if (String(item.author) !== String(req.user._id) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Action non autorisée");
  }
  Object.assign(item, req.body);
  await item.save();
  res.json({ success: true, item });
});

export const deleteBook = asyncHandler(async (req, res) => {
  const item = await Book.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Introuvable");
  }
  if (String(item.author) !== String(req.user._id) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Action non autorisée");
  }
  await item.deleteOne();
  res.json({ success: true });
});
