import mongoose from "mongoose";

const predicationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: String,
    type: { type: String, enum: ["audio", "video"], required: true },
    mediaUrl: { type: String, required: true },
    coverUrl: String,
    durationSec: Number,
    category: String,
    tags: [String],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["draft", "published", "removed"], default: "published" },
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    flagged: { type: Boolean, default: false },
  },
  { timestamps: true }
);

predicationSchema.index({ title: "text", description: "text", tags: "text" });

export default mongoose.model("Predication", predicationSchema);
