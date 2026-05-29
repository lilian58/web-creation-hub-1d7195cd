import multer from "multer";
import path from "path";
import fs from "fs";

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    cb(null, `${Date.now()}-${safe}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const mime = file.mimetype || "";
  const name = (file.originalname || "").toLowerCase();
  const isDoc =
    mime === "application/pdf" ||
    mime === "application/msword" ||
    mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    /\.(pdf|doc|docx)$/.test(name);
  const isMedia = /^(audio|video|image)\//.test(mime);
  if (isDoc || isMedia) cb(null, true);
  else cb(new Error("Type de fichier non autorisé (PDF, DOC, DOCX, audio, vidéo, image uniquement)"));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200 MB
});
