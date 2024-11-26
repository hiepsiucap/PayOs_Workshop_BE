/** @format */

const mongoose = require("mongoose");
const Counter = require("./Counter");
const { Schema } = mongoose;

const OrderSchema = new Schema({
  User: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  _id: {
    type: Number,
  },
  Subscription: {
    type: mongoose.Types.ObjectId,
  },
  status: {
    type: String,
    enum: ["PENDING", "CANCELLED", "PROCESSING", "COMPLETED"],
    default: "PENDING",
  },
  total: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  paymentLinkId: {
    type: String,
    default: "",
  },
});

OrderSchema.pre("save", async function (next) {
  if (!this.isNew) return next();
  const counter = await Counter.findOneAndUpdate(
    { model: "Payment" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this._id = counter.seq;
  next();
});
module.exports = mongoose.model("Order", OrderSchema);
