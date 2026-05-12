import { Router } from "express";
import multer from "multer";
import { protect, authorize } from "../middleware/auth.middleware.js";
import {
  getChapter,
  searchVerses,
  verseOfTheDay,
  listVersions,
  createVersion,
  deleteVersion,
} from "../controllers/bible.controller.js";

const router = Router();

// Upload mémoire pour les fichiers texte/JSON de version
const versionUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (_req, file, cb) => {
    const ok = /json|text|plain|octet-stream/.test(file.mimetype) ||
      /\.(json|txt)$/i.test(file.originalname);
    cb(ok ? null : new Error("Format de fichier non supporté (.json ou .txt)"), ok);
  },
});

router.get("/versions", listVersions);
router.get("/daily", verseOfTheDay);
router.get("/search", searchVerses);
router.get("/:book/:chapter", getChapter);

// Admin uniquement
router.post("/versions", protect, authorize("admin"), versionUpload.single("file"), createVersion);
router.delete("/versions/:id", protect, authorize("admin"), deleteVersion);

export default router;
