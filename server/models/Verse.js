import mongoose from "mongoose";

const verseSchema = new mongoose.Schema(
  {
    translation: { type: String, default: "LSG", index: true },
    book: { type: String, required: true, index: true },
    chapter: { type: Number, required: true },
    verse: { type: Number, required: true },
    text: { type: String, required: true },
  },
  { timestamps: false }
);

verseSchema.index({ translation: 1, book: 1, chapter: 1, verse: 1 }, { unique: true });
verseSchema.index({ text: "text" });

export default mongoose.model("Verse", verseSchema);
