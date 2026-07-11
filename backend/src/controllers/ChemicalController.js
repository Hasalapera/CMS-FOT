const { Chemical } = require('../models/index.js');
const { Op } = require('sequelize');

const addChemical = async (req, res) => {
  try {
    const {
      chemicalCode,
      canonicalName,
      stockDimension,
      baseUnit,
      casNumber,
      formula,
      physicalState,
    } = req.body;

    // Basic validation for required fields based on the model
    if (!chemicalCode || !canonicalName || !stockDimension || !baseUnit) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields. Chemical code, canonical name, stock dimension, and base unit are required.' 
      });
    }

    // Check if a chemical with the same code or name already exists (case-insensitive)
    const existingChemical = await Chemical.findOne({
      where: {
        [Op.or]: [
          { chemicalCode: { [Op.iLike]: chemicalCode.trim() } },
          { canonicalName: { [Op.iLike]: canonicalName.trim() } }
        ]
      },
    });

    if (existingChemical) {
      const field = existingChemical.chemicalCode.toLowerCase() === chemicalCode.trim().toLowerCase() ? 'code' : 'name';
      return res.status(409).json({ 
        success: false,
        message: `A chemical with this ${field} already exists.` 
      });
    }

    // Create the new chemical in the database
    const chemical = await Chemical.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Chemical created successfully',
      chemical,
    });
  } catch (error) {
    console.error('Error creating chemical:', error);
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join('. ') });
    }
    res.status(500).json({ success: false, message: 'Internal server error while creating chemical.' });
  }
};

module.exports = {
  addChemical,
};