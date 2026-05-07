import { Router } from "express";
import { getChapter, searchVerses, verseOfTheDay } from "../controllers/bible.controller.js";

const router = Router();
router.get("/daily", verseOfTheDay);
router.get("/search", searchVerses);
router.get("/:book/:chapter", getChapter);

export default router;
