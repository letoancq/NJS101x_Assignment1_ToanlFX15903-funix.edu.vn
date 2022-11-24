const mongoose = require("mongoose");

const Staff = require("../models/staff");

async function connect() {
  try {
    mongoose.connect(
      "mongodb+srv://letoan:letoan410@cluster0.m09swex.mongodb.net/asm2?retryWrites=true&w=majority"
    );
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
}

Staff.findOne()
  .then((staff) => {
    if (!staff) {
      const newStaff = new Staff({
        name: "Lê Toản ",
        email: "letoan@gmail.com",
        password: "letoan410",
        role: "staff",
        dOB: new Date(1990, 22, 02),
        salaryScale: 2,
        startDate: new Date(2022, 03, 09),
        department: "IT",
        annualLeave: 15,
        image:
          "https://res.cloudinary.com/https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvvSSa9ZjaTRxXwaIajmcZ77PKgXgFfWp9QQ&usqp=CAU/image/upload/v1586883417/person-3_ipa0mj.jpg",
        workTimes: [],
        listInfoList: [],
        bodyTemperature: [],
        vaccineInfo: [],
        infectCovidInfo: [],
      });
      newStaff.save();
    }
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = connect;
