const mongoose = require("mongoose");

const Staff = require("../models/staff");

async function connect() {
  try {
    mongoose.connect(
      "mongodb+srv://letoan:letoan410@cluster0.m09swex.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
}

module.exports = connect;
