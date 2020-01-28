"use strict";

const express = require("express");
const multipart = require("connect-multiparty");
// Initialize the app
const UserController = require("../controllers/user");

const api = express.Router();
const md_auth = require("../middlewares/authenticated");
const md_upload = multipart({ uploadDir: "uploads/users" });

//GET
api.get("/home", UserController.home);
api.get("/pruebas", md_auth.ensureAuth, UserController.pruebas);
api.get("/user/:id", md_auth.ensureAuth, UserController.getUser);
api.get("/users/:page?", md_auth.ensureAuth, UserController.getUsers);
api.get("/get-image-user/:imageFile", UserController.getImageFile);
api.get("/counters/:id?", md_auth.ensureAuth, UserController.getCount);

//POST
api.post("/register", UserController.saveUser);
api.post("/login", UserController.loginUser);
api.post(
  "/updload-image-user/:id",
  [md_auth.ensureAuth, md_upload],
  UserController.uploadImage
);

//PUT
api.put("/update-user/:id", md_auth.ensureAuth, UserController.updateUser);

module.exports = api;
