import { Router } from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import {
  listPredications,
  getPredication,
  createPredication,
  updatePredication,
  deletePredication,
  togglePredicationLike,
} from "../controllers/predication.controller.js";

const router = Router();

router.get("/", listPredications);
router.get("/:id", getPredication);

router.use(protect);
router.post("/", authorize("creator", "admin"), upload.single("media"), createPredication);
router.patch("/:id", updatePredication);
router.delete("/:id", deletePredication);
router.post("/:id/like", togglePredicationLike);

export default router;
