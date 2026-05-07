import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import {
  sendMessage,
  markRead,
  deleteMessage,
} from "../controllers/message.controller.js";

const router = Router();
router.use(protect);
router.post("/", upload.single("media"), sendMessage);
router.patch("/:id/read", markRead);
router.delete("/:id", deleteMessage);

export default router;
