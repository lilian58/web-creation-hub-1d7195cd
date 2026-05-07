import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["text", "image", "audio", "video", "verse", "system"], default: "text" },
    body: String,
    mediaUrl: String,
    verseRef: { book: String, chapter: Number, verse: Number, text: String },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    flagged: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
