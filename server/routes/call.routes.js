import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  initiateCall,
  updateCallStatus,
  listCalls,
} from "../controllers/call.controller.js";

const router = Router();
router.use(protect);
router.get("/", listCalls);
router.post("/", initiateCall);
router.patch("/:id", updateCallStatus);

export default router;
