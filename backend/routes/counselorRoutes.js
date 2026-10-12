const express = require('express');
const { protect, adminOnly, counselorOnly } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiters');
const {
  register,
  login,
  getCounselors,
  adminVerifyCounselor,
  adminRejectCounselor,
  getPendingCounselors,
  getMySchedule,
  updateMySchedule,
  getAvailability,
} = require('../controllers/counselorController');

const router = express.Router();

router.post('/counselors/register', authLimiter, register);
router.post('/counselors/login', authLimiter, login);
router.get('/counselors', getCounselors);
router.get('/counselors/me/schedule', protect, counselorOnly, getMySchedule);
router.patch('/counselors/me/schedule', protect, counselorOnly, updateMySchedule);
router.get('/counselors/:id/availability', getAvailability);
router.get('/admin/counselors/pending', protect, adminOnly, getPendingCounselors);
router.post('/admin/counselors/verify/:id', protect, adminOnly, adminVerifyCounselor);
router.post('/admin/counselors/reject/:id', protect, adminOnly, adminRejectCounselor);

module.exports = router;
