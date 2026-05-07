import asyncHandler from "express-async-handler";
import Predication from "../models/Predication.js";

// GET /api/predications
export const listPredications = asyncHandler(async (req, res) => {
  const { q, type, category, author } = req.query;
  const filter = { status: "published" };
  if (type) filter.type = type;
  if (category) filter.category = category;
  if (author) filter.author = author;
  if (q) filter.$text = { $search: q };
  const items = await Predication.find(filter)
    .populate("author", "name avatar role")
    .sort({ createdAt: -1 })
    .limit(100);
  res.json({ success: true, items });
});

// GET /api/predications/:id
export const getPredication = asyncHandler(async (req, res) => {
  const item = await Predication.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  ).populate("author", "name avatar role");
  if (!item) {
    res.status(404);
    throw new Error("Prédication introuvable");
  }
  res.json({ success: true, item });
});

// POST /api/predications  (creator/admin)
export const createPredication = asyncHandler(async (req, res) => {
  const mediaUrl =
    req.body.mediaUrl || (req.file ? `/uploads/${req.file.filename}` : null);
  if (!mediaUrl) {
    res.status(400);
    throw new Error("mediaUrl ou fichier requis");
  }
  const item = await Predication.create({
    ...req.body,
    mediaUrl,
    author: req.user._id,
  });
  res.status(201).json({ success: true, item });
});

// PATCH /api/predications/:id
export const updatePredication = asyncHandler(async (req, res) => {
  const item = await Predication.findById(req.params.id);
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

// DELETE /api/predications/:id
export const deletePredication = asyncHandler(async (req, res) => {
  const item = await Predication.findById(req.params.id);
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

// POST /api/predications/:id/like
export const togglePredicationLike = asyncHandler(async (req, res) => {
  const item = await Predication.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Introuvable");
  }
  const idx = item.likes.findIndex((u) => String(u) === String(req.user._id));
  if (idx >= 0) item.likes.splice(idx, 1);
  else item.likes.push(req.user._id);
  await item.save();
  res.json({ success: true, liked: idx < 0, count: item.likes.length });
});
