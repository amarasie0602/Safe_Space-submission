const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getAdminActions } = require('../controllers/adminActionController');

const router = express.Router();

router.get('/admin/actions', protect, adminOnly, getAdminActions);

module.exports = router;
