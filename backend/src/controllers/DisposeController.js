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
  if (!chemicalCode || !batchCode || !dateReleased || !purpose || !userId) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const chemical = await Chemical.findOne({
      where: { chemicalCode: chemicalCode },
    });
    if (!chemical) {
      return res.status(404).json({ message: "Chemical not found" });
    }
    const batch = await Batch.findOne({
      where: { batchNumber: batchCode },
    });
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }
    const dispose = await Dispose.create({
      chemicalCode: chemicalCode,
      chemicalName: chemical.canonicalName,
      batchNumber: batchCode,
      dateReleased: dateReleased,
      purpose: purpose,
      userId: userId,
      userName: userName,
      remark: remark,
    });
    res
      .status(201)
      .json({ message: "Release record created successfully", dispose });
  } catch (error) {
    console.error("Error creating release record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const updateqty = async (req, res) => {
  const { id } = req.params;
  const { quantityUsed, dateReturned } = req.body;
  if (!quantityUsed || !dateReturned) {
    return res
      .status(400)
      .json({ message: "Quantity used and date returned are required" });
  }
  try {
    const dispose = await Dispose.findByPk(id);
    if (!dispose) {
      return res.status(404).json({ message: "Dispose record not found" });
    }
    const batch = await Batch.findOne({
      where: { batchNumber: dispose.batchNumber },
    });
    if (!batch) {
      return res.status(404).json({
        message: "Batch not found",
      });
    }
    dispose.quantityUsed = quantityUsed;
    dispose.dateReturned = dateReturned;
    dispose.returnedStatus = "RETURNED";
    await dispose.save();
    if (Number(quantityUsed) > Number(batch.currentQuantity)) {
      return res.status(400).json({
        message: "Quantity used exceeds the current stock quantity",
      });
    }
    batch.currentQuantity =
      Number(batch.currentQuantity) - Number(quantityUsed);

    await batch.save();

    res.json({
      message: "Quantity updated and stock restored successfully",
      dispose,
      updatedStock: batch.currentQuantity,
    });
    res.json({ message: "Quantity updated successfully", dispose });
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const viewreturnedchemicals = async (req, res) => {
  try {
    const returnedChemicals = await Dispose.findAll({
      where: { returnedStatus: "RETURNED" },
    });
    if (returnedChemicals.length === 0) {
      return res.status(404).json({ message: "No returned chemicals found" });
    }
    res.json({ returnedChemicals });
  } catch (error) {
    console.error("Error fetching returned chemicals:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const viewnotreturnedchemicals = async (req, res) => {
  try {
    const notReturnedChemicals = await Dispose.findAll({
      where: { returnedStatus: "RELEASED" },
    });
    if (notReturnedChemicals.length === 0) {
      return res
        .status(404)
        .json({ message: "No not returned chemicals found" });
    }
    res.json({ notReturnedChemicals });
  } catch (error) {
    console.error("Error fetching not returned chemicals:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getformdata = async (req, res) => {
  try {
    const chemicals = await Chemical.findAll({
      attributes: ["id", "chemicalCode", "canonicalName"],
      order: [["chemicalCode", "ASC"]],
    });
    res.json({ chemicals });
  } catch (error) {
    console.error("Error fetching form data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getbatchbychemicalid = async (req, res) => {
  try {
    const { chemicalId } = req.params;
    const batches = await Batch.findAll({
      where: { chemicalId },
      attributes: ["batchNumber"],
      order: [["batchNumber", "ASC"]],
    });
    if (batches.length === 0) {
      return res
        .status(404)
        .json({ message: "No batches found for the specified chemical" });
    }
    res.json({ batches });
  } catch (error) {
    console.error("Error fetching batches by chemical ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createreleaserecord,
  updateqty,
  viewreturnedchemicals,
  viewnotreturnedchemicals,
  getformdata,
  getbatchbychemicalid,
};
