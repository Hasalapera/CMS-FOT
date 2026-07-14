const { Location, Batch, Chemical } = require('../models/index.js');
const { Op } = require('sequelize');
const { logAction } = require('../services/auditLogService.js');

const addLocation = async (req, res) => {
  try {
    const { name, type, parentLocationId } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: 'Location name and type are required.',
      });
    }

    // Explicitly handle empty string for parentLocationId to ensure it's treated as NULL in the query
    const parentId = (parentLocationId && parentLocationId.trim() !== '') ? parentLocationId : null;

    const existingLocation = await Location.findOne({
      where: {
        name: { [Op.iLike]: name.trim() },
        parentLocationId: parentId,
      }
    });

    if (existingLocation) {
      return res.status(409).json({
        success: false,
        message: `A location named "${name}" already exists at this level.`
      });
    }

    const newLocation = await Location.create({
      name: name.trim(),
      type,
      parentLocationId: parentId,
    });

    // Audit Log: Location Creation
    await logAction({
      userId: req.user?.id,
      userName: req.user?.fullName,
      actionType: "CREATE_LOCATION",
      entityType: "Location",
      entityId: newLocation.id,
      details: {
        name: newLocation.name,
        type: newLocation.type,
        parentLocationId: newLocation.parentLocationId,
      },
      ipAddress: req.ip,
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

const getDescendants = async (locationId) => {
  const location = await Location.findByPk(locationId, {
    include: [
      {
        model: Batch,
        as: 'batches',
        include: [{
          model: Chemical,
          as: 'chemical',
          attributes: ['id', 'canonicalName', 'chemicalCode', 'baseUnit']
        }]
      }
    ],
    order: [
      ['name', 'ASC'],
      [{ model: Batch, as: 'batches' }, 'createdAt', 'DESC']
    ]
  });

  if (!location) return null;

  const children = await Location.findAll({ where: { parentLocationId: locationId }, order: [['name', 'ASC']] });
  const childHierarchies = await Promise.all(children.map(child => getDescendants(child.id)));

  location.dataValues.children = childHierarchies.filter(c => c !== null);
  return location;
};

const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const locationHierarchy = await getDescendants(id);
    if (!locationHierarchy) {
      return res.status(404).json({ success: false, message: 'Location not found.' });
    }
    res.status(200).json({ success: true, location: locationHierarchy });
  } catch (error) {
    console.error(`Error fetching location with ID ${req.params.id}:`, error);
    res.status(500).json({ success: false, message: 'Internal server error while fetching location details.' });
  }
};

module.exports = {
  getAllLocations,
  addLocation,
  getLocationById,
};