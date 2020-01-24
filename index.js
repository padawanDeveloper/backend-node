"use strict";

const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.PORT || 8080;

mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost:27017/callarte", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successful connection");
    app.listen(port, () => {
      console.log("Running server on port " + port);
    });
  })
  .catch(err => console.log(err));
