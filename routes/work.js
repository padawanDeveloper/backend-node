"use strict";

const express = require("express");
const WorkController = require("../controllers/work");
const md_auth = require("../middlewares/authenticated");

const api = express.Router();

const multipart = require("connect-multiparty");
const md_upload = multipart({ uploadDir: "./uploads/works" });

api.get("/prueba", md_auth.ensureAuth, WorkController.prueba);

module.exports = api;
