"use strict";

const path = require("path");
const fs = require("fs");
const moment = require("moment");

const Work = require("../models/work");
const User = require("../models/user");
const Follow = require("../models/follow");

function prueba(req, res) {
  return res.status(200).send({ message: "hola work" });
}

module.exports = {
  prueba
};
