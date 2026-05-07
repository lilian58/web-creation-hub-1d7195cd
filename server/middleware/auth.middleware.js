import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) token = auth.split(" ")[1];
  else if (req.cookies?.token) token = req.cookies.token;

  if (!token) {
    res.status(401);
    throw new Error("Non authentifié");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select("-password");
  if (!user) {
    res.status(401);
    throw new Error("Utilisateur introuvable");
  }
  if (user.blocked) {
    res.status(403);
    throw new Error("Compte bloqué");
  }
  req.user = user;
  next();
});

// roles: 'user' | 'creator' | 'admin'
export const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Non authentifié");
  }
  if (!roles.includes(req.user.role)) {
    res.status(403);
    throw new Error(`Accès réservé: ${roles.join(", ")}`);
  }
  next();
};
