"use strict";

const mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate-v2");
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

WorkSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Work", WorkSchema);
