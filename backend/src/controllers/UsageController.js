const { Dispose } = require("../models/index.js");
const { Chemical } = require("../models/index.js");
const { Batch } = require("../models/index.js");
const { Op } = require("sequelize");

const retriveBatchDetails = async (req, res) => {
  try {
    const batchDetails = await Batch.findAll({
      attributes: ["id", "batchNumber"],
      include: [
        {
          model: Chemical,
          as: "chemical",
          attributes: ["canonicalName"],
        },
      ],
      order: [["batchNumber", "ASC"]],
    });

    res.json({ batchDetails });
  } catch (error) {
    console.error("Error retrieving batch details:", error);
    res.status(500).json({
      message: "An error occurred while retrieving batch details.",
    });
  }
};

const calculateUsageBatchvise = async (req, res) => {
  try {
    const { batchNumber } = req.body;

    const batch = await Batch.findOne({
      where: { batchNumber },
      include: [
        {
          model: Chemical,
          as: "chemical",
          attributes: ["chemicalCode", "canonicalName"],
        },
      ],
    });

    if (!batch) {
      return res.status(404).json({
        message: "Batch not found",
      });
    }

    const quantityReceived = Number(batch.quantityReceived);
    const currentQuantity = Number(batch.currentQuantity);
    const quantityUsed = quantityReceived - currentQuantity;

    res.json({
      batchNumber: batch.batchNumber,
      chemicalCode: batch.chemical.chemicalCode,
      chemicalName: batch.chemical.canonicalName,
      quantityReceived,
      currentQuantity,
      quantityUsed,
      expiryDate: batch.expiryDate,
      supplier: batch.supplier,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
const calculateUsageChemicalvise = async (req, res) => {
  try {
    const { chemicalCode } = req.body;

    const chemical = await Chemical.findOne({
      where: { chemicalCode },
    });

    if (!chemical) {
      return res.status(404).json({
        message: "Chemical not found",
      });
    }

    const batches = await Batch.findAll({
      where: {
        chemicalId: chemical.id,
      },
      order: [["batchNumber", "ASC"]],
    });

    const today = new Date();

    const result = batches.map((batch) => {
      const quantityReceived = Number(batch.quantityReceived);
      const currentQuantity = Number(batch.currentQuantity);
      const quantityUsed = quantityReceived - currentQuantity;

      return {
        batchNumber: batch.batchNumber,
        quantityReceived,
        currentQuantity,
        quantityUsed,
        expiryDate: batch.expiryDate,
        supplier: batch.supplier,
        status:
          batch.expiryDate && new Date(batch.expiryDate) < today
            ? "EXPIRED"
            : "ACTIVE",
      };
    });

    res.json({
      chemicalCode: chemical.chemicalCode,
      chemicalName: chemical.canonicalName,
      batches: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  retriveBatchDetails,
  calculateUsageBatchvise,
  calculateUsageChemicalvise,
};
