"use strict";

const express = require("express");

const UserController = require("../controllers/user");

const api = express.Router();

api.get("/home", UserController.home);
api.get("/pruebas", UserController.pruebas);

module.exports = api;
