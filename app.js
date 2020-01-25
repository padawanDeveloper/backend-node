// Import express
const express = require("express");
const bodyParser = require("body-parser");

// Initialize the app
let app = express();
const user_routes = require("./routes/user");

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use("/api", user_routes);

module.exports = app;
