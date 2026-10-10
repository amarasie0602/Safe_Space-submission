const express = require('express');
const { protect, staffOnly } = require('../middleware/authMiddleware');
const { createReport, adminGetReports, resolveReport } = require('../controllers/reportController');

const router = express.Router();

router.post('/reports', protect, createReport);
router.get('/admin/reports', protect, staffOnly, adminGetReports);
router.patch('/admin/reports/:id/resolve', protect, staffOnly, resolveReport);

module.exports = router;
