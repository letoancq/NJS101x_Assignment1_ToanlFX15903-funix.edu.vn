const attendanceRouter = require("./attendance");
const homeRouter = require("./home");
const staffRouter = require("./infoStaff");
const covidDetailRouter = require("./covidDetail");
const authRouter = require("./authRouter");
const manageStaffRouter = require("./manageStaff");
const manageCovidRouter = require("./manageCovid");
const isAuth = require("../middlewares/isAuth");
const isManage = require("../middlewares/isManage");

function router(app) {
  app.use("/attendance", isAuth, attendanceRouter);
  app.use("/staff", isAuth, staffRouter);
  app.use("/covidDetail", isAuth, covidDetailRouter);
  app.use("/manageStaff", isAuth, isManage, manageStaffRouter);
  app.use("/manageCovid", isAuth, isManage, manageCovidRouter);
  app.use("/auth", authRouter);
  app.use("/", isAuth, homeRouter);
}

module.exports = router;
