const express = require('express');
const router = express.Router();
const { getAllSchedules } = require('../controllers/scheduleControllers');

router.get('/', getAllSchedules);

module.exports = router;
