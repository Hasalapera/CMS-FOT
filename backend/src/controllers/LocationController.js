const { Location } = require('../models/index.js');
const { Op } = require('sequelize');

const addLocation = async (req, res) => {
  try {
    const { name, type, parentLocationId } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: 'Location name and type are required.',
      });
    }

    const existingLocation = await Location.findOne({
      where: {
        name: { [Op.iLike]: name.trim() }
      }
    });

    if (existingLocation) {
      return res.status(409).json({
        success: false,
        message: `A location with the name "${name}" already exists.`
      });
    }

    const newLocation = await Location.create({
      name: name.trim(),
      type,
      parentLocationId: parentLocationId || null,
    });

    res.status(201).json({
      success: true,
      message: 'New location added successfully.',
      location: newLocation,
    });

  } catch (error) {
    console.error('Error adding new location:', error);
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join('. ') });
    }
    res.status(500).json({ success: false, message: 'Internal server error while adding the location.' });
  }
};

const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.findAll({
      order: [['name', 'ASC']],
    });

    res.status(200).json({
      success: true,
      locations,
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ success: false, message: 'Internal server error while fetching locations.' });
  }
};

module.exports = {
  getAllLocations,
  addLocation,
};