import { Router } from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import {
  listBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/book.controller.js";

const router = Router();

router.get("/", listBooks);
router.get("/:id", getBook);

router.use(protect);
router.post("/", authorize("creator", "admin"), upload.single("file"), createBook);
router.patch("/:id", updateBook);
router.delete("/:id", deleteBook);

export default router;
