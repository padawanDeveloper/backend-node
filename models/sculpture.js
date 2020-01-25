"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SculptureSchema = Schema({
  material: String,
  technique: String
});

module.exports = mongoose.model("Sculpture", SculptureSchema);
