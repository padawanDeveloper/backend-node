"use strict";

var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate-v2");

var Schema = mongoose.Schema;

var UserSchema = Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  socialUrl: String,
  image: String
});

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("User", UserSchema);
