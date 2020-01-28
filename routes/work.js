"use strict";

const express = require("express");
const WorkController = require("../controllers/work");
const md_auth = require("../middlewares/authenticated");

const api = express.Router();

const multipart = require("connect-multiparty");
const md_upload = multipart({ uploadDir: "./uploads/works" });

api.post("/work", md_auth.ensureAuth, WorkController.saveWork);
api.get("/works/:page?", md_auth.ensureAuth, WorkController.getWorks);
api.get("/work/:id", md_auth.ensureAuth, WorkController.getWork);
api.delete("/work/:id", md_auth.ensureAuth, WorkController.deleteWork);
api.post(
  "/upload-image-work/:id",
  [md_auth.ensureAuth, md_upload],
  WorkController.uploadImage
);
api.get("/get-image-work/:imageFile", WorkController.getImageFile);

module.exports = api;
