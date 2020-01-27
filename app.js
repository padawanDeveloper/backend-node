// Import express
var express = require("express");
var bodyParser = require("body-parser");

// Initialize the app
var app = express();
var user_routes = require("./routes/user");

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use("/api", user_routes);

module.exports = app;
