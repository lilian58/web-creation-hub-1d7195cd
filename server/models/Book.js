import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    authorName: String,
    description: String,
    coverUrl: String,
    fileUrl: { type: String, required: true },
    format: { type: String, enum: ["pdf", "doc", "docx"], default: "pdf" },
    pages: Number,
    category: String,
    price: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published", "removed"], default: "published" },
    flagged: { type: Boolean, default: false },
  },
  { timestamps: true }
);

bookSchema.index({ title: "text", description: "text", category: "text" });

export default mongoose.model("Book", bookSchema);
