const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,

    // add a custom validation function to the Schema
    validate: {
      // test function
      validator: (value) => {
        return /^\S+@\S+$/.test(value);
      },
      // fail message
      message: "invalid email address",
    },
  },
});

module.exports = mongoose.model("User", userSchema);
