import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  listContacts,
  addContact,
  removeContact,
} from "../controllers/user.controller.js";

const router = Router();
router.use(protect);
router.get("/", listContacts);
router.post("/:id", addContact);
router.delete("/:id", removeContact);

export default router;
