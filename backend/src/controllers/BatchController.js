const { Batch, Chemical, Location } = require('../models/index.js');
const { Op } = require('sequelize');

const getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.findAll({
      include: [
        {
          model: Chemical,
          as: 'chemical',
          attributes: ['canonicalName', 'chemicalCode', 'baseUnit'],
        },
        {
          model: Location,
          as: 'location',
          attributes: ['name'],
        },
      ],
      order: [['receivedDate', 'DESC']],
    });

    res.status(200).json({
      success: true,
      batches,
    });
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ success: false, message: 'Internal server error while fetching batches.' });
  }
};

const addBatch = async (req, res) => {
  try {
    const {
      chemicalId,
      supplier,
      batchNumber,
      quantityReceived,
      currentQuantity,
      expiryDate,
      receivedDate,
      locationId,
    } = req.body;

    // --- Validation ---
    if (!chemicalId || !batchNumber || !quantityReceived || !receivedDate) {
      return res.status(400).json({
        success: false,
        message: 'Chemical, Batch Number, Quantity, and Received Date are required.',
      });
    }

    // Check if the chemical exists
    const chemical = await Chemical.findByPk(chemicalId);
    if (!chemical) {
      return res.status(404).json({
        success: false,
        message: 'The selected chemical does not exist.',
      });
    }

    // --- Create Batch ---
    const newBatch = await Batch.create({
      chemicalId,
      supplier: supplier?.trim() || null,
      batchNumber: batchNumber.trim(),
      quantityReceived,
      currentQuantity,
      expiryDate: expiryDate || null,
      receivedDate,
      locationId: locationId || null,
    });

    res.status(201).json({
      success: true,
      message: 'New batch added successfully.',
      batch: newBatch,
    });

  } catch (error) {
    console.error('Error adding new batch:', error);
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join('. ') });
    }
    res.status(500).json({ success: false, message: 'Internal server error while adding the batch.' });
  }
};

module.exports = {
  addBatch,
  getAllBatches,
};