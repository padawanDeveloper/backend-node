"use strict";

const User = require("../models/user");

// Routes
function home(req, res) {
  res.status(200).send({ message: "Hello World with Express" });
}

function pruebas(req, res) {
  res.status(200).send({ message: "Hello World with Express" });
}

module.exports = {
  home,
  pruebas
};
