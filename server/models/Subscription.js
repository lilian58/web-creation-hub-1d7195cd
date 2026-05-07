import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    plan: { type: String, enum: ["free", "plus", "family"], default: "free" },
    billing: { type: String, enum: ["monthly", "yearly"], default: "monthly" },
    status: { type: String, enum: ["active", "canceled", "past_due"], default: "active" },
    provider: { type: String, default: "stripe" },
    providerCustomerId: String,
    providerSubscriptionId: String,
    currentPeriodEnd: Date,
    paymentMethod: { brand: String, last4: String, exp: String },
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
