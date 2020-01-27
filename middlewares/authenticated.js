"use strict";

var jwt = require("jwt-simple");
var moment = require("moment");
var secret = "S3CR3T_P1ss";

exports.ensureAuth = function(req, res, next) {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({ message: "La autenticacion no tiene cabecera" });
  }

  var token = req.headers.authorization.replace(/['"]+/g, "");
  try {
    var payload = jwt.decode(token, secret);
    if (payload.exp >= moment.unix()) {
      return res.status(401).send({ message: "Token ha expirado" });
    }
  } catch (err) {
    return res.status(404).send({ message: "Token no es valido" });
  }

  req.user = payload;
  next();
};
