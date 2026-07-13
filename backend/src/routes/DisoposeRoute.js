const express = require("express");
const router = express.Router();
const DisoposeController = require("../controllers/DisposeController.js");

router.post("/createreleaserecord", DisoposeController.createreleaserecord);
router.put("/updateqty/:id", DisoposeController.updateqty);
router.get("/view/returned", DisoposeController.viewreturnedchemicals);
router.get("/view/notreturned", DisoposeController.viewnotreturnedchemicals);
router.get("/getformdata", DisoposeController.getformdata);
router.get("/getbatchbychemicalid/:chemicalId", DisoposeController.getbatchbychemicalid);
module.exports = router;
