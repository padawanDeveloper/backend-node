"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  socialUrl: String
});

module.exports = mongoose.model("User", UserSchema);
