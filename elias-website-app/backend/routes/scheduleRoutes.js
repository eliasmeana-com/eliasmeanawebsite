const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ScheduleAsset = require('../models/ScheduleAsset');

// GET document by _id
router.get('/asset/:id', async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid MongoDB ObjectId' });
    }

    const result = await ScheduleAsset.findById(id);
    if (!result) return res.status(404).json({ message: 'Asset not found' });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Query failed', details: err.message });
  }
});

module.exports = router;
