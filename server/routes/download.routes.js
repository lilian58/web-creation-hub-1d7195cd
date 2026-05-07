import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  listDownloads,
  upsertDownload,
  deleteDownload,
} from "../controllers/download.controller.js";

const router = Router();
router.use(protect);
router.get("/", listDownloads);
router.post("/", upsertDownload);
router.delete("/:id", deleteDownload);

export default router;
