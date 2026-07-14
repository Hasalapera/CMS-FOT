const express = require('express');
const router = express.Router();
const AuditLogController = require('../controllers/AuditLogController.js');

// --- IMPORTANT ---
// This route should be protected to ensure only ADMIN users can access it.
// You should add your authentication and role-checking middleware here.
// Example: router.get('/', verifyToken, isAdmin, AuditLogController.getLogs);

// GET /api/audit-logs - Fetch all audit logs
router.get('/', AuditLogController.getLogs);

module.exports = router;