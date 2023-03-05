// INITIAL SETUP

// import packages that make everytihing work
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// import Models (User, Article, etc). These are JavaScript representations of the collections of data
const User = require("./models/user");

// create a server instance
const app = express();
app.use(express.json());
// ----------------------------------------------------------------

// ROUTES

// get all users
/* note that since we are working with an external database, the finding of the data will be asynchronous, because it takes 
some amount of time for the database to receive the query and respond. We will need to tell our function to wait while this
happens, so we must make it asynchronous, hence we put `async` in front */
app.get("/users/", async (req, res) => {
  /* here we can use User, mongoose's representation of the user data that is based on a Schema we created, to ask mongoose to go find users.
  Each mongoose Model has a set of methods that they can use to communicate to MongoDB and interact with the collection
  they represent. In this case, we are using .find(), which requires an object that it uses to specify what is to be 
  found from the collection. Here, we are just leaving the filter object empty to say we want all items in the users collection */
  // this returns an array of documents, represented by JavaScript objects. We can send this straight to the client as JSON
  const userArray = await User.find({}); // <-- note that we need to `await` this as it takes some time to resolve

  // to confirm we are getting results we can console.log here to see what was returned
  console.log(userArray);

  // finally, we can send the data back to the client from which the get request was sent
  res.json(userArray);
});

// get a user by id
/* this route matches with any request that is a GET request to localhost:3000/users/* 
In this case, * can be anything as it is a dynameic segment, and we will assume it is a user ID. Since we are using MongoDB, each user will have been
assigned a unique id by the database system. If we send a reqeust up with one of these in the second segment of the url,
then we can use that with `.findById()` to get it from the database */
app.get("/users/:userId", async (req, res) => {
  /* we can use .findById(), which requires an ID string as an argument 
  .findById is a method all Models have that allows them to seek out a specific entry in the collection they represent.
  If it finds a matching document in the database, it returns a JavaScript object (also called a document) that represents this data */
  const requestedUser = await User.findById(req.params.userId);

  // just checking here to see if we are actually getting anything back
  console.log(requestedUser);

  // send back the retreived user information object
  res.json(requestedUser);
});

// create a user
/* here the request will have incoming data attached to the body. Assuming this data matches the Schema,
we can use it to create a new user document in the database using the .create() method. The create method
will then return the newly created user from the databse which you can then send back to the client if you like */
app.post("/users/", async (req, res) => {
  // use the data to create a new user. NOTE the data must match the requirements of the Schema or else it will be rejected
  const newUser = await User.create(req.body);

  // can then either end the interaction with .end() or send back the new user like below
  res.json(newUser);
});

// update a user
/* updating a user can be done in several ways, the way shown here is quite simple, but has three parts.
first we need to find and retreive the user we want to update. Then we edit their document (it's an object so we
can just use regular object notation using the membership operator '.'). Finally we save the edited user. Running save
on an existing user will cause it to be updated rather than a new user being created */
app.put("/users/:userId", async (req, res) => {
  // get the user document to be edited from the database using findById()
  const userToUpdate = await User.findById(req.params.userId);

  // edit the user document (here we replace the user email address with the one from the request body).
  // The logic that goes here is entirely dependent on how your use-cases handle editing. The logic is up to you.
  userToUpdate.email = req.body.email;

  // finally we save the edited user back to the database. This also returns the user, so we catch it in a variable
  const updatedUser = await userToUpdate.save();

  // and then we can send that variable back to the client if we like
  res.json(updatedUser);
});

// delete a user by id
app.delete("/users/:userId", async (req, res) => {
  // use findByIdAndDelete to delete the user from the database. This returns the user that is to be deleted
  const deletedUser = await User.findByIdAndDelete(req.params.userId);

  // we can send the to be deleted user to the client if we like
  res.json(deletedUser);
});
// ----------------------------------------------------------------

// DATABASE CONNECTION

/* Establish an initial connection with MongoDB using the connection string. If the initial connection fails (often
  due to wrong credentials), then it will emit an error which we can handle with `.catch()`
*/
mongoose.connect(process.env.DB_STRING).catch((error) => {
  // callback function that runs if the error listener receives an error object
  console.log(error); // <-- just console log the error for now
});

// we can also add listeners to the connection to MongoDB that monitor the connection for events
// this listener will fire once the connection is established, and it then executes its callback function
mongoose.connection.on("connected", () => {
  // the callback function logs a success message
  console.log("connected to database");
  // and then runs the code that makes the server start listening for HTTP request from clients
  app.listen(process.env.PORT, () => {
    console.log("listening on port " + process.env.PORT);
  });
});

// this listener fires if there is an error at any point while the connection is active, and logs it to the console
mongoose.connection.on("error", (error) => {
  console.log(error);
});
