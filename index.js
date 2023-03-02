// import packages
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// import Models
const User = require("./models/user");

const app = express();

// routes go here
app.get("/users/:username", async (req, res) => {
  const userArray = await User.find({});
  console.log(userArray);
  res.json(userArray);
});

mongoose.connect(process.env.DB_STRING).catch((error) => {
  console.log(error);
});

mongoose.connection.on("connected", () => {
  console.log("connected to database");
  app.listen(process.env.PORT, () => {
    console.log("listening on port " + process.env.PORT);
  });
});

mongoose.connection.on("error", (error) => {
  console.log(error);
});
