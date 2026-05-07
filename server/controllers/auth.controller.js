import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { signToken, setAuthCookie } from "../utils/token.js";

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error("Email déjà utilisé");
  }
  const user = await User.create({ name, email, password });
  const token = signToken(user._id);
  setAuthCookie(res, token);
  res.status(201).json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Identifiants invalides");
  }
  if (user.blocked) {
    res.status(403);
    throw new Error("Compte bloqué");
  }
  user.lastSeenAt = new Date();
  await user.save();
  const token = signToken(user._id);
  setAuthCookie(res, token);
  res.json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, plan: user.plan },
  });
});

// POST /api/auth/logout
export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

// GET /api/auth/me
export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});
