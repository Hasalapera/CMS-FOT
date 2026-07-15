const { Batch, Chemical, Location } = require('../models/index.js');
const { Op } = require('sequelize');
const {
  notifyExpiringBatches,
  notifyLowStockBatch,
  notifyLowStockBatches,
} = require('../services/notificationService.js');

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

    await notifyExpiringBatches();
    await notifyLowStockBatch(newBatch.id);

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

const checkLowStockNotifications = async (req, res) => {
  try {
    if (!['ADMIN', 'TECHNICAL_OFFICER'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Only admins and technical officers can run low stock notification checks.',
      });
    }

    const result = await notifyLowStockBatches();

    if (result.error) {
      return res.status(500).json({
        success: false,
        message: 'Low stock notification check failed.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Low stock notification check completed.',
      result,
    });
  } catch (error) {
    console.error('Error checking low stock notifications:', error);
    res.status(500).json({ success: false, message: 'Internal server error while checking low stock notifications.' });
  }
};

const checkExpiryNotifications = async (req, res) => {
  try {
    if (!['ADMIN', 'TECHNICAL_OFFICER'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Only admins and technical officers can run expiry notification checks.',
      });
    }

    const result = await notifyExpiringBatches();

    if (result.error) {
      return res.status(500).json({
        success: false,
        message: 'Expiry notification check failed.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expiry notification check completed.',
      result,
    });
  } catch (error) {
    console.error('Error checking expiry notifications:', error);
    res.status(500).json({ success: false, message: 'Internal server error while checking expiry notifications.' });
  }
};

const getLocationPath = async (locationId, LocationModel) => {
  const path = [];
  let currentLocation = await LocationModel.findByPk(locationId, { attributes: ['id', 'name', 'parentLocationId'] });
  while (currentLocation) {
    path.unshift({ id: currentLocation.id, name: currentLocation.name });
    if (currentLocation.parentLocationId) {
      currentLocation = await LocationModel.findByPk(currentLocation.parentLocationId, { attributes: ['id', 'name', 'parentLocationId'] });
    } else {
      currentLocation = null;
    }
  }
  return path;
};

const getBatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findByPk(id, {
      include: [
        {
          model: Chemical,
          as: 'chemical',
        },
        {
          model: Location,
          as: 'location',
        },
      ],
    });

    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found.' });
    }

    // If a location is associated, fetch its full path
    if (batch.location) {
      const path = await getLocationPath(batch.location.id, Location);
      const batchJson = batch.toJSON();
      batchJson.location.path = path;
      return res.status(200).json({ success: true, batch: batchJson });
    }

    return res.status(200).json({ success: true, batch });
  } catch (error) {
    console.error(`Error fetching batch with ID ${req.params.id}:`, error);
    res.status(500).json({ success: false, message: 'Internal server error while fetching batch details.' });
  }
};

module.exports = {
  addBatch,
  getAllBatches,
  getBatchById,
  checkExpiryNotifications,
  checkLowStockNotifications,
};
