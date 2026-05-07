import asyncHandler from "express-async-handler";
import Call from "../models/Call.js";

// POST /api/calls
export const initiateCall = asyncHandler(async (req, res) => {
  const { callee, type } = req.body;
  const call = await Call.create({
    type,
    caller: req.user._id,
    callee,
    status: "ringing",
    startedAt: new Date(),
  });
  res.status(201).json({ success: true, call });
});

// PATCH /api/calls/:id
export const updateCallStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const call = await Call.findById(req.params.id);
  if (!call) {
    res.status(404);
    throw new Error("Appel introuvable");
  }
  call.status = status;
  if (["ended", "missed", "rejected"].includes(status)) {
    call.endedAt = new Date();
    if (call.startedAt) {
      call.durationSec = Math.round((call.endedAt - call.startedAt) / 1000);
    }
  }
  await call.save();
  res.json({ success: true, call });
});

// GET /api/calls
export const listCalls = asyncHandler(async (req, res) => {
  const calls = await Call.find({
    $or: [{ caller: req.user._id }, { callee: req.user._id }],
  })
    .populate("caller callee", "name avatar")
    .sort({ createdAt: -1 })
    .limit(50);
  res.json({ success: true, calls });
});
