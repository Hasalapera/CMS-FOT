const express = require("express");
const router = express.Router();
const UsageController = require("../controllers/UsageController");

router.get("/batch-details", UsageController.retriveBatchDetails);
router.post("/batch/calculate-usage", UsageController.calculateUsageBatchvise);
router.post("/chemical/calculate-usage", UsageController.calculateUsageChemicalvise);

module.exports = router;
