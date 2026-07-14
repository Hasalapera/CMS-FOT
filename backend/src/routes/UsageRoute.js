const express = require("express");
const router = express.Router();
const UsageController = require("../controllers/UsageController");
const verifyToken = require('../middlewares/Authmiddleware.js');

router.get("/batch-details", verifyToken, UsageController.retriveBatchDetails);
router.post(
  "/batch/calculate-usage",
  verifyToken,
  UsageController.calculateUsageBatchvise,
);
router.post(
  "/chemical/calculate-usage",
  verifyToken,
  UsageController.calculateUsageChemicalvise,
);

module.exports = router;
