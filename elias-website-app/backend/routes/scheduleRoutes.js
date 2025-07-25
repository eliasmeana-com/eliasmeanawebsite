const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ScheduleAsset = require('../models/ScheduleAsset');

// GET document by _id
router.get('/:id', async (req, res) => {
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
router.get('/range', async (req, res) => {
    try {
      const { start, end } = req.query;
  
      if (!start || !end) {
        return res.status(400).json({ error: 'Please provide start and end query parameters' });
      }
  
      const results = await ScheduleAsset.find({
        start_date: { $gte: start },
        end_date: { $lte: end }
      });
  
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: 'Query failed', details: err.message });
    }
  });
  router.get('/all', async (req, res) => {
    try {
      const assets = await ScheduleAsset.find({});
      res.json(assets);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch schedule assets', details: err.message });
    }
  });
router.post('/add', async (req, res) => {
  try {
    const newAsset = new ScheduleAsset(req.body);
    const savedAsset = await newAsset.save();
    res.status(201).json(savedAsset);
  } catch (err) {
    console.error('Error saving schedule asset:', err);
    res.status(400).json({ error: 'Failed to add schedule asset', details: err.message });
  }
});
module.exports = router;
