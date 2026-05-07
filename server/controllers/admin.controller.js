import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Predication from "../models/Predication.js";
import Book from "../models/Book.js";
import Report from "../models/Report.js";

// GET /api/admin/stats
export const stats = asyncHandler(async (_req, res) => {
  const [users, predications, books, reports] = await Promise.all([
    User.countDocuments(),
    Predication.countDocuments(),
    Book.countDocuments(),
    Report.countDocuments({ status: "pending" }),
  ]);
  res.json({ success: true, stats: { users, predications, books, reports } });
});

// GET /api/admin/reports
export const listReports = asyncHandler(async (req, res) => {
  const { status = "pending" } = req.query;
  const items = await Report.find({ status })
    .populate("reporter", "name email")
    .sort({ createdAt: -1 });
  res.json({ success: true, items });
});

// POST /api/admin/reports
export const createReport = asyncHandler(async (req, res) => {
  const { targetType, targetId, reason, details } = req.body;
  const report = await Report.create({
    reporter: req.user._id,
    targetType,
    targetId,
    reason,
    details,
  });
  res.status(201).json({ success: true, report });
});

// PATCH /api/admin/reports/:id
export const resolveReport = asyncHandler(async (req, res) => {
  const { action, note } = req.body; // action: dismiss | remove | block
  const report = await Report.findById(req.params.id);
  if (!report) {
    res.status(404);
    throw new Error("Signalement introuvable");
  }

  if (action === "remove") {
    if (report.targetType === "predication")
      await Predication.findByIdAndUpdate(report.targetId, { status: "removed" });
    if (report.targetType === "book")
      await Book.findByIdAndUpdate(report.targetId, { status: "removed" });
    report.status = "actioned";
  } else if (action === "block") {
    if (report.targetType === "user")
      await User.findByIdAndUpdate(report.targetId, { blocked: true });
    report.status = "actioned";
  } else {
    report.status = "dismissed";
  }
  report.moderator = req.user._id;
  report.moderatorNote = note;
  await report.save();
  res.json({ success: true, report });
});

// PATCH /api/admin/users/:id/block
export const toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("Utilisateur introuvable");
  }
  user.blocked = !user.blocked;
  await user.save();
  res.json({ success: true, user });
});

// PATCH /api/admin/users/:id/role
export const setUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!["user", "creator", "admin"].includes(role)) {
    res.status(400);
    throw new Error("Rôle invalide");
  }
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  res.json({ success: true, user });
});
