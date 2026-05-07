import asyncHandler from "express-async-handler";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

// GET /api/conversations
export const listConversations = asyncHandler(async (req, res) => {
  const items = await Conversation.find({ participants: req.user._id })
    .populate("participants", "name avatar role lastSeenAt")
    .populate("lastMessage")
    .sort({ lastMessageAt: -1 });
  res.json({ success: true, items });
});

// POST /api/conversations
export const createConversation = asyncHandler(async (req, res) => {
  const { participants = [], isGroup = false, name } = req.body;
  const all = Array.from(new Set([String(req.user._id), ...participants.map(String)]));

  if (!isGroup && all.length === 2) {
    const existing = await Conversation.findOne({
      isGroup: false,
      participants: { $all: all, $size: 2 },
    });
    if (existing) return res.json({ success: true, conversation: existing });
  }

  const conv = await Conversation.create({
    participants: all,
    isGroup,
    name,
    createdBy: req.user._id,
  });
  res.status(201).json({ success: true, conversation: conv });
});

// GET /api/conversations/:id/messages
export const listMessages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { before, limit = 50 } = req.query;
  const conv = await Conversation.findOne({ _id: id, participants: req.user._id });
  if (!conv) {
    res.status(404);
    throw new Error("Conversation introuvable");
  }
  const filter = { conversation: id };
  if (before) filter.createdAt = { $lt: new Date(before) };
  const messages = await Message.find(filter)
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .populate("sender", "name avatar");
  res.json({ success: true, messages: messages.reverse() });
});
