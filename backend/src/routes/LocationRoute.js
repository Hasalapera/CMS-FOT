const express = require('express');
const LocationController = require('../controllers/LocationController.js');
const verifyToken = require('../middlewares/Authmiddleware.js');

const router = express.Router();

// Route to get all locations
router.get('/', verifyToken, LocationController.getAllLocations);

// Route to add a new location
router.post('/', verifyToken, LocationController.addLocation);

// Route to get a single location by ID with its hierarchy
router.get('/:id', verifyToken, LocationController.getLocationById);

module.exports = router;