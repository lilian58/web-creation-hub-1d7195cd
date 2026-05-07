import asyncHandler from "express-async-handler";
import Subscription from "../models/Subscription.js";
import User from "../models/User.js";

export const getSubscription = asyncHandler(async (req, res) => {
  const sub = await Subscription.findOne({ user: req.user._id });
  res.json({ success: true, subscription: sub });
});

export const upsertSubscription = asyncHandler(async (req, res) => {
  const { plan, billing } = req.body;
  if (!["free", "plus", "family"].includes(plan)) {
    res.status(400);
    throw new Error("Plan invalide");
  }
  const sub = await Subscription.findOneAndUpdate(
    { user: req.user._id },
    {
      user: req.user._id,
      plan,
      billing: billing || "monthly",
      status: "active",
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 3600 * 1000),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  await User.findByIdAndUpdate(req.user._id, { plan });
  res.json({ success: true, subscription: sub });
});

export const cancelSubscription = asyncHandler(async (req, res) => {
  const sub = await Subscription.findOneAndUpdate(
    { user: req.user._id },
    { status: "canceled" },
    { new: true }
  );
  res.json({ success: true, subscription: sub });
});
