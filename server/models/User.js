import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true, minlength: 6, select: false },
    avatar: String,
    bio: String,
    role: { type: String, enum: ["user", "creator", "admin"], default: "user" },
    plan: { type: String, enum: ["free", "plus", "family"], default: "free" },
    planRenewsAt: Date,
    pushToken: String,
    blocked: { type: Boolean, default: false },
    lastSeenAt: Date,
    contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    favoritePredications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Predication" }],
    favoriteVerses: [{ book: String, chapter: Number, verse: Number, text: String }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

export default mongoose.model("User", userSchema);
