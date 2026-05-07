import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  listNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/note.controller.js";

const router = Router();
router.use(protect);
router.get("/", listNotes);
router.post("/", createNote);
router.get("/:id", getNote);
router.patch("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
