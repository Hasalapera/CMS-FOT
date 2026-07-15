const express = require("express");
const router = express.Router();
const reportController = require("../controllers/ReportController");

router.get("/chemicals/:chemicalCode", reportController.getChemicalReport);
router.get(
  "/chemicals/:chemicalCode/download",
  reportController.downloadChemicalReport,
);

module.exports = router;
