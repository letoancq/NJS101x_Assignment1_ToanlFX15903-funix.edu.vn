const express = require("express");
const router = express.Router();

const manageCovidController = require("../controller/manageCovidController");

router.get("/", manageCovidController.getIndex);
router.post("/covidDetail", manageCovidController.postCovid);
router.get("/covidDetail/:id", manageCovidController.getPDF);

module.exports = router;
