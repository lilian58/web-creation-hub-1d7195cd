import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetType: { type: String, enum: ["user", "predication", "book", "message"], required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    reason: { type: String, required: true },
    details: String,
    status: { type: String, enum: ["pending", "reviewed", "dismissed", "actioned"], default: "pending" },
    moderator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    moderatorNote: String,
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
