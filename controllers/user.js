"use strict";
var bcrypt = require("bcrypt");

var User = require("../models/user");

// Routes
function home(req, res) {
  res.status(200).send({ message: "Hello World with Express" });
}

function pruebas(req, res) {
  res.status(200).send({ message: "Hello World with Express" });
}

function saveUser(req, res) {
  var params = req.body;
  var user = new User();
  if (
    params.name &&
    params.email &&
    params.password &&
    //params.rol &&
    params.socialUrl
  ) {
    user.name = params.name;
    user.email = params.email;
    user.password = params.password;
    user.role = "ROLE_USER";
    user.socialUrl = params.socialUrl;

    User.find({ email: user.email.toLowerCase() }).exec((err, users) => {
      if (err) return res.status(500).send({ message: "error en la peticion" });
      if (users && users.length >= 1)
        return res.status(200).send({ message: "El email ya existe" });
    });

    bcrypt.hash(params.password, 10, (err, hash) => {
      user.password = hash;
      user.save((err, userStored) => {
        if (err) return res.status(500).send({ message: "error al guardar" });
        if (userStored) {
          res.status(200).send({ user: userStored });
        } else {
          res.status(400).send({ message: "No se ha registrado el usuario" });
        }
      });
    });
  } else {
    res.status(200).send({ message: "Rellenar datos" });
  }
}

function loginUser(req, res) {
  var params = req.body;
  var email = params.email;

  User.findOne({ email: email }, (err, user) => {
    if (err) return res.status(500).send({ message: "Error en la peticion" });
    if (user) {
      bcrypt.compare(params.password, user.password, (err, check) => {
        if (check) {
          res.status(200).send({ user: user });
        } else {
          return res.status(404).send({ message: "Error en la password" });
        }
      });
    } else {
      return res.status(400).send({ message: "Error en la peticion" });
    }
  });
}

module.exports = {
  home,
  loginUser,
  saveUser,
  pruebas
};
