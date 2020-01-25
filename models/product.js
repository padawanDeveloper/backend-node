"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = Schema({
  name: String,
  quantity: Number
});

module.exports = mongoose.model("Product", ProductSchema);
