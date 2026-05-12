import mongoose from "mongoose";

const bibleVersionSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    language: { type: String, default: "fr", lowercase: true },
    description: String,
    versesCount: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("BibleVersion", bibleVersionSchema);
