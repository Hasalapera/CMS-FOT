const { Chemical } = require('../models/index.js');
const { Op } = require('sequelize');

const getNextChemicalCode = async (req, res) => {
  try {
    // Count all existing chemicals to determine the next ID
    const chemicalCount = await Chemical.count();
    const nextId = chemicalCount + 1;

    // Format the number with leading zeros to a length of 6
    const paddedId = String(nextId).padStart(6, '0');
    const nextCode = `CHE-${paddedId}`;

    res.status(200).json({
      success: true,
      nextCode,
    });
  } catch (error) {
    console.error('Error generating next chemical code:', error);
    res.status(500).json({ success: false, message: 'Internal server error while generating chemical code.' });
  }
};

const addChemical = async (req, res) => {
  try {
    // When using multipart/form-data, arrays and other types might be stringified.
    const payload = { ...req.body };

    if (payload.synonyms && typeof payload.synonyms === 'string') {
      try {
        payload.synonyms = JSON.parse(payload.synonyms);
      } catch (e) {
        console.warn("Could not parse synonyms, defaulting to empty array.", payload.synonyms);
        payload.synonyms = [];
      }
    }

    // Basic validation for required fields based on the model
    if (!payload.chemicalCode || !payload.canonicalName || !payload.stockDimension || !payload.baseUnit) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields. Chemical code, canonical name, stock dimension, and base unit are required.' 
      });
    }

    // Check if a chemical with the same code or name already exists (case-insensitive)
    const existingChemical = await Chemical.findOne({
      where: {
        [Op.or]: [
          { chemicalCode: { [Op.iLike]: payload.chemicalCode.trim() } },
          { canonicalName: { [Op.iLike]: payload.canonicalName.trim() } }
        ]
      },
    });

    if (existingChemical) {
      const field = existingChemical.chemicalCode.toLowerCase() === payload.chemicalCode.trim().toLowerCase() ? 'code' : 'name';
      return res.status(409).json({ 
        success: false,
        message: `A chemical with this ${field} already exists.` 
      });
    }

    // Add file info to the payload if a file was uploaded
    if (req.file) {
      payload.sdsStorageKey = req.file.filename; // Store filename only, not the full path
      payload.sdsOriginalFilename = req.file.originalname;
      payload.sdsMimeType = req.file.mimetype;
      payload.sdsFileSize = req.file.size;
      payload.sdsUploadedAt = new Date();
      payload.sdsUploadedById = req.user.id; // From verifyToken middleware
    }

    // Create the new chemical in the database
    const chemical = await Chemical.create(payload);

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

const getAllChemicals = async (req, res) => {
  try {
    const chemicals = await Chemical.findAll({ // Only fetch active chemicals by default
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json({
      success: true,
      chemicals,
    });
  } catch (error) {
    console.error('Error fetching chemicals:', error);
    res.status(500).json({ success: false, message: 'Internal server error while fetching chemicals.' });
  }
};

const getInactiveChemicals = async (req, res) => {
  try {
    const chemicals = await Chemical.findAll({
      where: { isActive: false },
      order: [['updatedAt', 'DESC']], // Order by when they were deactivated
    });
    res.status(200).json({
      success: true,
      chemicals,
    });
  } catch (error) {
    console.error('Error fetching inactive chemicals:', error);
    res.status(500).json({ success: false, message: 'Internal server error while fetching inactive chemicals.' });
  }
};

const getChemicalById = async (req, res) => {
  try {
    const { id } = req.params;
    const chemical = await Chemical.findByPk(id);

    if (!chemical) {
      return res.status(404).json({ success: false, message: 'Chemical not found.' });
    }

    res.status(200).json({
      success: true,
      chemical,
    });
  } catch (error) {
    console.error(`Error fetching chemical with ID ${req.params.id}:`, error);
    res.status(500).json({ success: false, message: 'Internal server error while fetching chemical details.' });
  }
};

const updateChemical = async (req, res) => {
  const { id } = req.params;
  try {
    const chemical = await Chemical.findByPk(id);
    if (!chemical) {
      return res.status(404).json({ success: false, message: 'Chemical not found.' });
    }

    const payload = { ...req.body };

    if (payload.synonyms && typeof payload.synonyms === 'string') {
      try {
        payload.synonyms = JSON.parse(payload.synonyms);
      } catch (e) {
        console.warn("Could not parse synonyms on update, keeping original.", payload.synonyms);
        payload.synonyms = chemical.synonyms;
      }
    }

    if (payload.canonicalName && payload.canonicalName.trim().toLowerCase() !== chemical.canonicalName.toLowerCase()) {
      const existingChemical = await Chemical.findOne({
        where: {
          canonicalName: { [Op.iLike]: payload.canonicalName.trim() },
          id: { [Op.ne]: id }
        },
      });
      if (existingChemical) {
        return res.status(409).json({
          success: false,
          message: `A chemical with the name "${payload.canonicalName}" already exists.`
        });
      }
    }

    if (req.file) {
      // Note: This doesn't delete the old file. For a production system, you'd want a cleanup job.
      payload.sdsStorageKey = req.file.filename; // Store filename only, not the full path
      payload.sdsOriginalFilename = req.file.originalname;
      payload.sdsMimeType = req.file.mimetype;
      payload.sdsFileSize = req.file.size;
      payload.sdsUploadedAt = new Date();
      payload.sdsUploadedById = req.user.id;
    }

    await chemical.update(payload);

    res.status(200).json({
      success: true,
      message: 'Chemical updated successfully',
      chemical,
    });
  } catch (error) {
    console.error(`Error updating chemical with ID ${id}:`, error);
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join('. ') });
    }
    res.status(500).json({ success: false, message: 'Internal server error while updating chemical.' });
  }
};

const softDeleteChemical = async (req, res) => {
  const { id } = req.params;
  try {
    const chemical = await Chemical.findByPk(id);
    if (!chemical) {
      return res.status(404).json({ success: false, message: 'Chemical not found.' });
    }

    // Soft delete by setting isActive to false
    chemical.isActive = false;
    await chemical.save();

    res.status(200).json({
      success: true,
      message: 'Chemical has been deactivated successfully.',
    });
  } catch (error) {
    console.error(`Error deactivating chemical with ID ${id}:`, error);
    res.status(500).json({ success: false, message: 'Internal server error while deactivating chemical.' });
  }
};

const reactivateChemical = async (req, res) => {
  const { id } = req.params;
  try {
    const chemical = await Chemical.findByPk(id);
    if (!chemical) {
      return res.status(404).json({ success: false, message: 'Chemical not found.' });
    }

    // Reactivate by setting isActive to true
    chemical.isActive = true;
    await chemical.save();

    res.status(200).json({
      success: true,
      message: 'Chemical has been reactivated successfully.',
      chemical,
    });
  } catch (error) {
    console.error(`Error reactivating chemical with ID ${id}:`, error);
    res.status(500).json({ success: false, message: 'Internal server error while reactivating chemical.' });
  }
};

module.exports = {
  addChemical,
  getNextChemicalCode,
  getAllChemicals,
  updateChemical,
  getChemicalById,
  softDeleteChemical,
  getInactiveChemicals,
  reactivateChemical,
};