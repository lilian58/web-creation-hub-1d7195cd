import asyncHandler from "express-async-handler";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import { getIO } from "../config/socket.js";

// POST /api/messages
export const sendMessage = asyncHandler(async (req, res) => {
  const { conversation, type = "text", body, mediaUrl, verseRef } = req.body;
  const conv = await Conversation.findOne({
    _id: conversation,
    participants: req.user._id,
  });
  if (!conv) {
    res.status(404);
    throw new Error("Conversation introuvable");
  }
  const file = req.file ? `/uploads/${req.file.filename}` : mediaUrl;
  const msg = await Message.create({
    conversation,
    sender: req.user._id,
    type,
    body,
    mediaUrl: file,
    verseRef,
  });
  conv.lastMessage = msg._id;
  conv.lastMessageAt = new Date();
  await conv.save();
  try {
    getIO().to(`conv:${conversation}`).emit("message:new", msg);
  } catch {}
  res.status(201).json({ success: true, message: msg });
});

// PATCH /api/messages/:id/read
export const markRead = asyncHandler(async (req, res) => {
  const msg = await Message.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { readBy: req.user._id } },
    { new: true }
  );
  res.json({ success: true, message: msg });
});

// DELETE /api/messages/:id
export const deleteMessage = asyncHandler(async (req, res) => {
  const msg = await Message.findById(req.params.id);
  if (!msg) {
    res.status(404);
    throw new Error("Message introuvable");
  }
  if (String(msg.sender) !== String(req.user._id) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Action non autorisée");
  }
  await msg.deleteOne();
  res.json({ success: true });
});
