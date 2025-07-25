const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');

// ✅ Test DB query route
router.get('/test', async (req, res) => {
  try {
    const sample = await Schedule.findOne(); // fetch any document
    res.json({
      message: 'Query successful!',
      result: sample || 'No data found',
    });
  } catch (err) {
    res.status(500).json({ error: 'DB query failed', details: err.message });
  }
});

module.exports = router;
