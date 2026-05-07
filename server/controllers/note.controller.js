import asyncHandler from "express-async-handler";
import Note from "../models/Note.js";

export const listNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user._id }).sort({ pinned: -1, updatedAt: -1 });
  res.json({ success: true, notes });
});

export const getNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
  if (!note) {
    res.status(404);
    throw new Error("Note introuvable");
  }
  res.json({ success: true, note });
});

export const createNote = asyncHandler(async (req, res) => {
  const note = await Note.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, note });
});

export const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  if (!note) {
    res.status(404);
    throw new Error("Note introuvable");
  }
  res.json({ success: true, note });
});

export const deleteNote = asyncHandler(async (req, res) => {
  const r = await Note.deleteOne({ _id: req.params.id, user: req.user._id });
  if (!r.deletedCount) {
    res.status(404);
    throw new Error("Note introuvable");
  }
  res.json({ success: true });
});
