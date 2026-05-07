import mongoose from "mongoose";

const downloadSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    itemType: { type: String, enum: ["predication", "book"], required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: String,
    sizeMb: Number,
    progress: { type: Number, default: 100 },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

downloadSchema.index({ user: 1, itemId: 1 }, { unique: true });

export default mongoose.model("Download", downloadSchema);
