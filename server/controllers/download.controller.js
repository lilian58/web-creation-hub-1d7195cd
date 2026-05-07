import asyncHandler from "express-async-handler";
import Download from "../models/Download.js";

export const listDownloads = asyncHandler(async (req, res) => {
  const items = await Download.find({ user: req.user._id }).sort({ updatedAt: -1 });
  res.json({ success: true, items });
});

export const upsertDownload = asyncHandler(async (req, res) => {
  const { itemType, itemId, title, sizeMb, progress = 100, available = true } = req.body;
  const item = await Download.findOneAndUpdate(
    { user: req.user._id, itemId },
    { user: req.user._id, itemType, itemId, title, sizeMb, progress, available },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  res.status(201).json({ success: true, item });
});

export const deleteDownload = asyncHandler(async (req, res) => {
  await Download.deleteOne({ user: req.user._id, _id: req.params.id });
  res.json({ success: true });
});
