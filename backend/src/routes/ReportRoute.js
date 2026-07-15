const express = require("express");
const router = express.Router();
const reportController = require("../controllers/ReportController");

router.get("/chemicals/:chemicalCode", reportController.getChemicalReport);
router.get(
  "/chemicals/:chemicalCode/download",
  reportController.downloadChemicalReport,
);

router.get("/usage", reportController.getUsageReport);
router.get("/usage/download", reportController.downloadUsageReport);

module.exports = router;
