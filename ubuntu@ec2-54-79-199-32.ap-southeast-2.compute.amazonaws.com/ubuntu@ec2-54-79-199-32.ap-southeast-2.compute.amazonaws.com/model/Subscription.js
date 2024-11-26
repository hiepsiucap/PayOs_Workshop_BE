/** @format */

const mongoose = require("mongoose");
const { Schema } = mongoose;
const SubscriptionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Subscription", SubscriptionSchema);
