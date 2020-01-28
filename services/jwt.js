"use strict";

var jwt = require("jwt-simple");
var moment = require("moment");
var secret = "S3CR3T_P1ss";

exports.createToken = function(user) {
  var payload = {
    sub: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    socialUrl: user.socialUrl,
    iat: moment().unix(),
    exp: moment()
      .add(30, "days")
      .unix()
  };
  return jwt.encode(payload, secret);
};

exports.decodeToken = function(token) {
  var decoded = jwt.decode(token, secret);
  return decoded;
};
