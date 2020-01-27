// Import express
const express = require("express");
const bodyParser = require("body-parser");

// Initialize the app
const app = express();
const user_routes = require("./routes/user");
const follow_routes = require("./routes/follow");

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use("/api", user_routes);
app.use("/api", follow_routes);

module.exports = app;
