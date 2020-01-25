"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WorkSchema = Schema({
  name: String,
  type: String,
  paiting: [{ type: Schema.ObjectId, ref: "paiting" }],
  sculture: [{ type: Schema.ObjectId, ref: "sculture" }],
  author: String,
  description: String,
  image: String
});

module.exports = mongoose.model("Work", WorkSchema);
