import { Router } from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import {
  stats,
  listReports,
  createReport,
  resolveReport,
  toggleBlockUser,
  setUserRole,
} from "../controllers/admin.controller.js";

const router = Router();

// Tout signalement nécessite juste d'être authentifié
router.use(protect);
router.post("/reports", createReport);

// Le reste est réservé aux admins
router.use(authorize("admin"));
router.get("/stats", stats);
router.get("/reports", listReports);
router.patch("/reports/:id", resolveReport);
router.patch("/users/:id/block", toggleBlockUser);
router.patch("/users/:id/role", setUserRole);

export default router;
