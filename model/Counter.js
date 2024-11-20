/** @format */

const mongoose = require("mongoose");
const { Schema } = mongoose;

const CounterSchema = new Schema({
  model: { type: String, required: true, unique: true },
  seq: { type: Number, required: true },
});

module.exports = mongoose.model("Counter", CounterSchema);
