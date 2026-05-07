import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  listConversations,
  createConversation,
  listMessages,
} from "../controllers/conversation.controller.js";

const router = Router();
router.use(protect);
router.get("/", listConversations);
router.post("/", createConversation);
router.get("/:id/messages", listMessages);

export default router;
