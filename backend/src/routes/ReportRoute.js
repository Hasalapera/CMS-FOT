const express = require("express");
const router = express.Router();
const reportController = require("../controllers/ReportController");

// chemical wise report
router.get("/chemicals/:chemicalCode", reportController.getChemicalReport);
router.get(
  "/chemicals/:chemicalCode/download",
  reportController.downloadChemicalReport,
);

// usage report
router.get("/usage", reportController.getUsageReport);
router.get("/usage/download", reportController.downloadUsageReport);

// Full Inventory Status Report
router.get("/inventory/download", reportController.downloadFullInventoryReport);

module.exports = router;
