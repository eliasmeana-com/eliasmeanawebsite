const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const AssignmentCode = require('../models/Assignments');


router.get('/object/all', async (req, res) => {
  try {
    const assets = await AssignmentCode.find({});
    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch schedule assets', details: err.message });
  }
});
router.put('/object/update/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid MongoDB ObjectId' });
    }

    const updatedAsset = await AssignmentCode.findByIdAndUpdate(id, updates, {
      new: true, // return updated document
      runValidators: true // validate against schema
    });

    if (!updatedAsset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    res.json(updatedAsset);
  } catch (err) {
    res.status(500).json({ error: 'Update failed', details: err.message });
  }
});
router.get('/object/classCode/:classCode', async (req, res) => {
  try {
    const classCode = req.params.classCode;

    // Find all documents matching classCode
    const assets = await AssignmentCode.find({ classCode });

    if (!assets || assets.length === 0) {
      return res.status(404).json({ message: 'No assets found' });
    }

    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch assets by classCode', details: err.message });
  }
});

router.post('/object/create/:pageCode', async (req, res) => {
  try {
    const { pageCode } = req.params;
    const { latexCode } = req.body;

    if (!latexCode || typeof latexCode !== 'string') {
      return res.status(400).json({ error: 'latexCode is required and must be a string.' });
    }

    // Check if a document with the same pageCode already exists
    const existing = await AssignmentCode.findOne({ pageCode });
    if (existing) {
      return res.status(409).json({ error: 'A document with this pageCode already exists.' });
    }

    const newDoc = new AssignmentCode({
      pageCode,
      latexCode
    });

    await newDoc.save();

    res.status(201).json({
      message: 'LaTeX document created successfully.',
      document: newDoc
    });
  } catch (err) {
    res.status(500).json({
      error: 'Failed to create LaTeX document.',
      details: err.message
    });
  }
});

module.exports = router;