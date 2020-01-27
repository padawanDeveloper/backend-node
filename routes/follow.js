"use strict";

const express = require("express");

const FollowController = require("../controllers/follow");

const api = express.Router();

const md_auth = require("../middlewares/authenticated");

api.post("/follow", md_auth.ensureAuth, FollowController.saveFollow);
api.delete("/follow/:id", md_auth.ensureAuth, FollowController.deleteFollow);
api.delete(
  "/following/:id?/:page?",
  md_auth.ensureAuth,
  FollowController.getFollowingUser
);
api.delete(
  "/followed/:id?/:page?",
  md_auth.ensureAuth,
  FollowController.getFollowedUser
);

module.exports = api;
