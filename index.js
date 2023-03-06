// INITIAL SETUP

const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/user");

const app = express();
app.use(express.json());

// ----------------------------------------------------------------

// MIDDLEWARE
/* Middlewares are route handlers that do not send a response, but perform some operation as a result of an incoming request.
They are like utilities that can be inserted into the request response pipeline to help out with tasks */

// request logger
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);

  // since middlewares do not send back responses, the client will still be waiting for a reply
  // we use next() to pass the request down the stack to the endpoints
  next();
});

// ----------------------------------------------------------------

// ROUTES

// get all users
// this route has a third parameter called the next() function. It is used to pass on information down the stack in middlware or for error handling
app.get("/users/", async (req, res, next) => {
  try {
    // start try/catch block pair. If an error occurs in the try block, then it aborts and runs the catch block instead
    const userArray = await User.find({});
    res.json(userArray);
  } catch (error) {
    // if there was an error in the try block, then the catch block is executed instead, automatically receiving an error object
    // here we are using the next() function to pass any error down the stack. It will arrive in the error handling middleware
    next(error);
  }
});

// get a user by id
app.get("/users/:userId", async (req, res, next) => {
  // try to handle the request
  try {
    const requestedUser = await User.findById(req.params.userId);
    res.json(requestedUser);

    // if there is an error, pass it down to the error handlers
  } catch (error) {
    next(error);
  }
});

// create a user
app.post("/users/", async (req, res, next) => {
  // etc
  try {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } catch (error) {
    next(error);
  }
});

// update a user
app.put("/users/:userId", async (req, res, error) => {
  try {
    const userToUpdate = await User.findById(req.params.userId);
    userToUpdate.email = req.body.email;
    const updatedUser = await userToUpdate.save();
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

// delete a user by id
app.delete("/users/:userId", async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId);
    res.json(deletedUser);
  } catch (error) {
    next(error);
  }
});

// ----------------------------------------------------------------
// error handling middlewares
/* error handling middlewares are defined using four parameters. By adding try/catch blocks to routes, 
we can use the next() function to pass any errors down the stack of routes, where they end up in these middlewares.
Since they have four parameters, the first one will automatically receive any errors being passed down the stack.
Here we can define what behaviour should occur if an error comes down the stack. */

// error logger
app.use((error, req, res, next) => {
  console.log(`error ${error.status}, ${error.message}`);
  // pass the error on to the next middleware
  next(error);
});

// error responder
app.use((error, req, res, next) => {
  // we are sending the response here so no need to pass on the error, this ends the HTTP interaction
  res.status(error.status || 400).json(error.message);
});

// catchall route for requests that don't match preceding routes. By not specifying a method (GET POST etc) or a route, this matches with anything
// if a request isn't handled by any of the preceding routes, it ends up here and triggers this catchall
app.use((req, res) => {
  // .use and no route means this matches with anything that makes it this far
  console.log("invalid route");
  res.send("404, invalid route");
});
// ----------------------------------------------------------------
// DB CONNECTION

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
