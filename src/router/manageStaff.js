const express = require("express");
const router = express.Router();

const manageStaffController = require("../controller/manageStaffController");

router.get("/", manageStaffController.getIndex);
router.post("/staff", manageStaffController.postStaff);
router.post(
  "/postDeleteWorkTime",
  manageStaffController.postDeleteWorkTime
);
router.post(
  "/comfirmTimeWork",
  manageStaffController.postComfirmTimeWork
);

module.exports = router;
