const reportController = require("../controllers/ReportController");
const verifyToken = require('../middlewares/Authmiddleware.js');
const express = require("express");
const router = express.Router();

// chemical wise report
router.get("/chemicals/:chemicalCode",verifyToken, reportController.getChemicalReport);
router.get(
  "/chemicals/:chemicalCode/download",
  verifyToken,
  reportController.downloadChemicalReport,
);

// usage report
router.get("/usage", verifyToken, reportController.getUsageReport);
router.get("/usage/download",verifyToken, reportController.downloadUsageReport);

// Full Inventory Status Report
router.get("/inventory/download", verifyToken, reportController.downloadFullInventoryReport);

module.exports = router;
