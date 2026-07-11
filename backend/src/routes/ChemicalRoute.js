const express = require('express');
const ChemicalController = require('../controllers/ChemicalController.js');
const verifyToken = require('../middlewares/Authmiddleware.js');

const router = express.Router();

// Route to add a new chemical
router.post('/add-chemical', verifyToken, ChemicalController.addChemical);

module.exports = router;