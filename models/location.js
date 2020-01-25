"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocationSchema = Schema({
  latitude: String,
  longitude: String,
  street: String,
  city: String,
  region: String,
  country: String,
  isoCountryCode: String,
  postalCode: String
});

module.exports = mongoose.model("Location", LocationSchema);
