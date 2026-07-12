const { Dispose } = require("../models/index.js");
const { Chemical } = require("../models/index.js");
const { Batch } = require("../models/index.js");

const createreleaserecord = async (req, res) => {
  const {
    chemicalCode,
    batchCode,
    dateReleased,
    purpose,
    userId,
    userName,
    remark,
  } = req.body;
};
const updateqty = async (req, res) => {};
const viewreturnedchemicals = async (req, res) => {};
const viewnotreturnedchemicals = async (req, res) => {};
const getchemicalcodes = async (req, res) => {};
const getbatchcodes = async (req, res) => {};

module.exports = {
  createreleaserecord,
  updateqty,
  viewreturnedchemicals,
  viewnotreturnedchemicals,
  getchemicalcodes,
  getbatchcodes,
};
