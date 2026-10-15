const express = require('express');
const { getCommunityStats } = require('../controllers/communityController');

const router = express.Router();

router.get('/community/stats', getCommunityStats);

module.exports = router;
