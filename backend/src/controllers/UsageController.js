const { Dispose, Chemical, Batch, sequelize } = require("../models/index.js");
const { Op, QueryTypes } = require("sequelize");
const { logAction } = require('../services/auditLogService.js');

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
          attributes: ["chemicalCode", "canonicalName", "baseUnit"],
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

    // Audit Log: View Batch Usage Report
    await logAction({
      userId: req.user.id,
      userName: req.user.fullName,
      actionType: "VIEW_BATCH_USAGE_REPORT",
      entityType: "Batch",
      entityId: batch.id,
      details: {
        batchNumber: batch.batchNumber,
        chemicalCode: batch.chemical.chemicalCode,
      },
      ipAddress: req.ip,
    });

    res.json({
      batchNumber: batch.batchNumber,
      chemicalCode: batch.chemical.chemicalCode,
      chemicalName: batch.chemical.canonicalName,
      unit: batch.chemical.baseUnit,
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

    // Audit Log: View Chemical Usage Report
    await logAction({
      userId: req.user.id,
      userName: req.user.fullName,
      actionType: "VIEW_CHEMICAL_USAGE_REPORT",
      entityType: "Chemical",
      entityId: chemical.id,
      details: {
        chemicalCode: chemical.chemicalCode,
        chemicalName: chemical.canonicalName,
      },
      ipAddress: req.ip,
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

const getDashboardUsageTrend = async (req, res) => {
  try {
    const { startDate, endDate, chemicalCode, batchNumber } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "startDate and endDate query parameters are required.",
      });
    }

    if (!chemicalCode && !batchNumber) {
      return res.status(400).json({
        message: "Select a chemical or batch to generate the usage trend.",
      });
    }

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({
        message: "Invalid startDate or endDate query parameter.",
      });
    }

    if (start > end) {
      return res.status(400).json({
        message: "startDate cannot be later than endDate.",
      });
    }

    end.setHours(23, 59, 59, 999);

    const whereClause = {
      dateReturned: {
        [Op.not]: null,
        [Op.between]: [start, end],
      },
      returnedStatus: "RETURNED",
      quantityUsed: { [Op.gt]: 0 },
    };

    if (chemicalCode) {
      whereClause.chemicalCode = chemicalCode;
    }

    if (batchNumber) {
      whereClause.batchNumber = batchNumber;
    }

    const trendDate = sequelize.fn(
      "date_trunc",
      "day",
      sequelize.col("date_returned"),
    );

    const trend = await Dispose.findAll({
      attributes: [
        [sequelize.fn("to_char", trendDate, "YYYY-MM-DD"), "date"],
        [sequelize.fn("SUM", sequelize.col("quantity_used")), "totalQuantity"],
      ],
      where: whereClause,
      group: [trendDate],
      order: [[trendDate, "ASC"]],
      raw: true,
    });

    let unit = "";
    let label = "";
    let totalUsed = 0;

    if (batchNumber) {
      const batch = await Batch.findOne({
        where: { batchNumber },
        include: [
          {
            model: Chemical,
            as: "chemical",
            attributes: ["canonicalName", "chemicalCode", "baseUnit"],
            ...(chemicalCode ? { where: { chemicalCode } } : {}),
          },
        ],
      });

      if (batch?.chemical) {
        unit = batch.chemical.baseUnit || "";
        label = `${batch.chemical.canonicalName} - ${batch.batchNumber}`;
        totalUsed = Number(batch.quantityReceived || 0) - Number(batch.currentQuantity || 0);
      } else {
        label = batchNumber;
      }
    } else if (chemicalCode) {
      const chemical = await Chemical.findOne({
        where: { chemicalCode },
        attributes: ["id", "canonicalName", "chemicalCode", "baseUnit"],
      });

      if (chemical) {
        unit = chemical.baseUnit || "";
        label = `${chemical.canonicalName} (${chemical.chemicalCode})`;

        const batches = await Batch.findAll({
          where: { chemicalId: chemical.id },
          attributes: ["quantityReceived", "currentQuantity"],
        });

        totalUsed = batches.reduce(
          (sum, batch) =>
            sum +
            (Number(batch.quantityReceived || 0) - Number(batch.currentQuantity || 0)),
          0,
        );
      } else {
        label = chemicalCode;
      }
    }

    return res.json({
      success: true,
      label,
      unit,
      totalUsed: Number(totalUsed.toFixed(4)),
      trend: trend.map((item) => ({
        date: item.date,
        totalQuantity: Number(item.totalQuantity || 0),
      })),
    });
  } catch (error) {
    console.error("Error fetching dashboard usage trend:", error);
    return res.status(500).json({
      message: "An error occurred while generating the dashboard usage trend.",
    });
  }
};

const getUsageByHazardCategory = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "startDate and endDate query parameters are required.",
      });
    }

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({
        message: "Invalid startDate or endDate query parameter.",
      });
    }

    if (start > end) {
      return res.status(400).json({
        message: "startDate cannot be later than endDate.",
      });
    }

    end.setHours(23, 59, 59, 999);

    const rows = await sequelize.query(
      `
        SELECT
          COALESCE(c.hazard_category::text, 'OTHER') AS "hazardCategory",
          SUM(d.quantity_used)::float AS "totalQuantity",
          COUNT(d.id)::int AS "recordCount"
        FROM disposals d
        LEFT JOIN chemicals c
          ON c.chemical_code = d.chemical_code
        WHERE d.date_returned IS NOT NULL
          AND d.date_returned BETWEEN :startDate AND :endDate
          AND d.returned_status = 'RETURNED'
          AND d.quantity_used > 0
        GROUP BY COALESCE(c.hazard_category::text, 'OTHER')
        ORDER BY SUM(d.quantity_used) DESC
      `,
      {
        replacements: { startDate: start, endDate: end },
        type: QueryTypes.SELECT,
      },
    );

    const categories = rows.map((row) => ({
      hazardCategory: row.hazardCategory || "OTHER",
      totalQuantity: Number(row.totalQuantity || 0),
      recordCount: Number(row.recordCount || 0),
    }));

    return res.json({
      success: true,
      categories,
      totalQuantity: categories.reduce(
        (sum, item) => sum + Number(item.totalQuantity || 0),
        0,
      ),
      totalRecords: categories.reduce(
        (sum, item) => sum + Number(item.recordCount || 0),
        0,
      ),
    });
  } catch (error) {
    console.error("Error fetching usage by hazard category:", error);
    return res.status(500).json({
      message: "An error occurred while generating usage by hazard category.",
    });
  }
};

module.exports = {
  retriveBatchDetails,
  calculateUsageBatchvise,
  calculateUsageChemicalvise,
  getDashboardUsageTrend,
  getUsageByHazardCategory,
};
