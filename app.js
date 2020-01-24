// Import express
const express = require("express");
const bodyParser = require("body-parser");

// Initialize the app
let app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => res.status(200).send("Hello World with Express"));

module.exports = app;
