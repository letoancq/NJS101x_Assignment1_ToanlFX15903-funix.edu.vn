const Staff = require("../models/staff");
const Methods = require("../utils/methods");
const dateformat = require("date-format");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

class ManageCovidController {
  getIndex = (req, res) => {
    Staff.find({ role: "staff" })
      .then((staffs) => {
        const id = staffs[0]._id;
        const name = staffs[0].name;
        res.render("manage/covid", {
          isLoggedIn: req.session.isLoggedIn,
          path: "/manageStaff",
          pageTitle: "Manage Staff",
          isStarted: null,
          name,
          id,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  postCovid = (req, res) => {
    if (req.body.staff === "none") {
      return res.redirect("/manageCovid");
    }
    Staff.find({ role: "staff" }).then((staffs) => {
      Staff.findById(req.body.staff)
        .lean()
        .then((staff) => {
          const temperature = staff.bodyTemperature.map((bodyTemperature) => {
            return {
              date: dateformat("dd/MM/yyyy", bodyTemperature.date),
              time: bodyTemperature.time,
              temperature: bodyTemperature.temperature,
            };
          });
          const vaccine = staff.vaccineInfo.map((vaccine) => {
            return {
              date: dateformat("dd/MM/yyyy", vaccine.date),
              nameVaccine: vaccine.nameVaccine,
            };
          });
          const infect = staff.infectCovidInfo.map((infect) => {
            return {
              datePositive: dateformat("dd/MM/yyyy", infect.ddatePositiveate),
              dateRecover: dateformat("dd/MM/yyyy", infect.dateRecover),
              isolationDate: infect.isolationDate,
            };
          });
          res.render("manage/covidDetail", {
            isLoggedIn: req.session.isLoggedIn,
            path: "/manageCovid",
            pageTitle: "Manage Covid",
            isStarted: null,
            isLoggedIn: req.session.isLoggedIn,
            role: req.session.staff.role,
            temperature,
            vaccine,
            infect,
            staff,
          });
        });
    });
  };

  getPDF(req, res, next) {
    Staff.find({ role: "staff" })
      .then((staffs) => {
        const doc = new PDFDocument();
        const pathDoc = path.join("src/data", "pdf");
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline");
        doc.pipe(fs.createWriteStream(pathDoc));
        doc.font(path.join(__dirname, "../public/fonts/Roboto-Regular.ttf"));
        doc.pipe(res);
        doc.text("Tên nhân viên: " + staffs[0].name);
        doc.text("Nhiệt độ: " + staffs[0].bodyTemperature[0].temperature);
        doc.text("Vaccine mũi một: " + staffs[0].vaccineInfo[0].nameVaccine);
        doc.text("Ngày tiêm: " + dateformat("dd/MM/yyyy", staffs[0].vaccineInfo[0].date));
        doc.text("Vaccine mũi một: " + staffs[0].vaccineInfo[1].nameVaccine);
        doc.text("Ngày tiêm: " + dateformat("dd/MM/yyyy", staffs[0].vaccineInfo[1].date));
        doc.end();
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

module.exports = new ManageCovidController();
