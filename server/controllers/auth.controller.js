import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { signToken, setAuthCookie } from "../utils/token.js";

// Rôles autorisés à l'inscription publique. L'admin n'est jamais auto-attribué :
// il doit être promu par un autre admin via /api/admin/users/:id/role.
const PUBLIC_SIGNUP_ROLES = ["user", "creator"];

const sanitize = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  role: user.role,
  plan: user.plan,
});

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error("Email déjà utilisé");
  }

  // Sécurité : on n'autorise jamais la création d'un admin par cette route.
  const safeRole = PUBLIC_SIGNUP_ROLES.includes(role) ? role : "user";

  const user = await User.create({ name, email, password, role: safeRole });
  const token = signToken(user._id);
  setAuthCookie(res, token);

  res.status(201).json({ success: true, token, user: sanitize(user) });
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
  res.json({ success: true, token, user: sanitize(user) });
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
