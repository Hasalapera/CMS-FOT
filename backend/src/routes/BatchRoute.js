const express = require('express');
const BatchController = require('../controllers/BatchController.js');
const verifyToken = require('../middlewares/Authmiddleware.js');

const router = express.Router();

// Route to get all batches
router.get('/', verifyToken, BatchController.getAllBatches);

// Route to add a new batch
router.post('/', verifyToken, BatchController.addBatch);

module.exports = router;