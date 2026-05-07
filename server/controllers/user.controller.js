import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// GET /api/users
export const listUsers = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const filter = q ? { name: { $regex: q, $options: "i" } } : {};
  const users = await User.find(filter).limit(50);
  res.json({ success: true, users });
});

// GET /api/users/:id
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("Utilisateur introuvable");
  }
  res.json({ success: true, user });
});

// PATCH /api/users/me
export const updateMe = asyncHandler(async (req, res) => {
  const allowed = ["name", "bio", "avatar", "pushToken"];
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([k]) => allowed.includes(k))
  );
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
  res.json({ success: true, user });
});

// PATCH /api/users/me/role  (mode démo / upgrade créateur)
export const switchRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!["user", "creator"].includes(role)) {
    res.status(400);
    throw new Error("Rôle non autorisé via cette route");
  }
  const user = await User.findByIdAndUpdate(req.user._id, { role }, { new: true });
  res.json({ success: true, user });
});

// POST /api/users/me/contacts/:id
export const addContact = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $addToSet: { contacts: req.params.id } });
  res.json({ success: true });
});

// DELETE /api/users/me/contacts/:id
export const removeContact = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $pull: { contacts: req.params.id } });
  res.json({ success: true });
});

// GET /api/users/me/contacts
export const listContacts = asyncHandler(async (req, res) => {
  const me = await User.findById(req.user._id).populate("contacts", "name email avatar role lastSeenAt");
  res.json({ success: true, contacts: me.contacts });
});
