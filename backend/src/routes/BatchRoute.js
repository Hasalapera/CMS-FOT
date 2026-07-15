const express = require('express');
const BatchController = require('../controllers/BatchController.js');
const verifyToken = require('../middlewares/Authmiddleware.js');

const router = express.Router();

// Route to get all batches
router.get('/', verifyToken, BatchController.getAllBatches);

// Route to add a new batch
router.post('/', verifyToken, BatchController.addBatch);

// Route to manually run expiry notification checks
router.post('/expiry-notifications/check', verifyToken, BatchController.checkExpiryNotifications);

// Route to manually run low stock notification checks
router.post('/low-stock-notifications/check', verifyToken, BatchController.checkLowStockNotifications);

// Route to get a single batch by ID
router.get('/:id', verifyToken, BatchController.getBatchById);

module.exports = router;
