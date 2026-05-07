import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getSubscription,
  upsertSubscription,
  cancelSubscription,
} from "../controllers/subscription.controller.js";

const router = Router();
router.use(protect);
router.get("/", getSubscription);
router.post("/", upsertSubscription);
router.delete("/", cancelSubscription);

export default router;
