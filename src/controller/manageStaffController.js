const Staff = require("../models/staff");
const Methods = require("../utils/methods");
const dateformat = require("date-format");

class ManageStaffController {
  getIndex(req, res, next) {
    Staff.find({ role: "staff" })
      .then((staffs) => {
        const id = staffs[0]._id;
        const name = staffs[0].name;
        res.render("manage/index", {
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
  }

  // POST /manageStaff
  postStaff(req, res, next) {
    if (req.body.staff === "none") {
      return res.redirect("/manageStaff");
    }
    Staff.find({ role: "staff" }).then((staffs) => {
      Staff.findById(req.body.staff)
        .lean()
        .then((staff) => {
          const workTimes = staff.workTimes.filter((workTime) => {
            return (
              Number(dateformat("MM", workTime.startTime)) ===
              Number(req.body.month)
            );
          });
          const length = staff.workTimes.length;
          if (staff.workTimes.length === 0) {
            res.render("manage/staff", {
              path: "/manageStaff",
              pageTitle: "Manage Staff",
              isLoggedIn: req.session.isLoggedIn,
            });
          } else {
            const timeWorked = Methods.calculateTimeWorked(staff);
            const workInDay = timeWorked.workTimeInDay.map((work) => {
              const endTime = work.endTime
                ? dateformat("hh:mm", work.endTime)
                : "--";
              return {
                startDay: dateformat("dd/MM/yyyy", work.startTime),
                startTime: dateformat("hh:mm", work.startTime),
                workPlace: work.workPlace,
                endTime: endTime,
                working: work.working,
                id: work._id,
              };
            });
            const month = req.body.month;
            const overTime = Methods.overTime(
              Methods.calculateTimeWorked(staff)
            );
            const dayLeave = staff.leaveInfoList.map((leaveInfoList) => {
              return {
                day: dateformat("dd/MM/yyyy", leaveInfoList.daysLeave),
                time: leaveInfoList.timesLeave,
                reason: leaveInfoList.reason,
              };
            });
            res.render("manage/staff", {
              isLoggedIn: req.session.isLoggedIn,
              path: "/manageStaff",
              pageTitle: "Manage Staff",
              isStarted: null,
              workInDay,
              length,
              csrfToken: req.body._csrf,
              id: staff._id,
              overTime,
              dayLeave,
              staff,
              month,
              timeWorked,
              dayLeave,
              overTime,
              isStarted: Methods.CheckIsStarted(req.staff),
            });
          }
        });
    });
  }

  postDeleteWorkTime(req, res, next) {
    Staff.findById(req.body.staffId)
      .then((staff) => {
        const workTimeDelete = staff.workTimes.filter((workTime) => {
          return workTime._id.toString() === req.body.workTime;
        });
        const updateWorkTime = staff.workTimes.filter((workTime) => {
          return workTime._id.toString() !== workTimeDelete[0]._id.toString();
        });
        staff.workTimes = updateWorkTime;
        return staff.save();
      })
      .then((result) => {
        res.redirect("/manageStaff");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  postComfirmTimeWork(req, res, next) {
    Staff.findById(req.body.staffId)
      .then((staff) => {
        staff.isConfirm.push({
          confirmed: true,
          month: req.body.month,
        });
        staff.save();
      })
      .then((result) => {
        res.redirect("/manageStaff");
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

module.exports = new ManageStaffController();
