import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  listUsers,
  getUser,
  updateMe,
  switchRole,
  addContact,
  removeContact,
  listContacts,
} from "../controllers/user.controller.js";

const router = Router();

router.use(protect);
router.get("/", listUsers);
router.patch("/me", updateMe);
router.patch("/me/role", switchRole);
router.get("/me/contacts", listContacts);
router.post("/me/contacts/:id", addContact);
router.delete("/me/contacts/:id", removeContact);
router.get("/:id", getUser);

export default router;
