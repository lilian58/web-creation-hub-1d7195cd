import mongoose from "mongoose";

const callSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["audio", "video"], required: true },
    caller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    callee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["ringing", "ongoing", "ended", "missed", "rejected"], default: "ringing" },
    startedAt: Date,
    endedAt: Date,
    durationSec: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Call", callSchema);
