import { Router } from "express";
import { body } from "express-validator";
import { register, login, logout, me } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

router.post(
  "/register",
  body("name").isLength({ min: 2 }),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  validate,
  register
);

router.post(
  "/login",
  body("email").isEmail(),
  body("password").notEmpty(),
  validate,
  login
);

router.post("/logout", logout);
router.get("/me", protect, me);

export default router;
