"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaitingSchema = Schema({
  colors: [String],
  technique: String,
  materials: [{ type: Schema.ObjectId, ref: "paiting" }]
});

module.exports = mongoose.model("Paiting", PaitingSchema);
