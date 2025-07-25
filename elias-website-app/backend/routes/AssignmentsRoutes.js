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

router.post('/object/create/:classCode', async (req, res) => {
  try {
    const { classCode } = req.params;
    const { latexCode, assignmentName, dueDate } = req.body;

    // Basic validation
    if (!latexCode || typeof latexCode !== 'string') {
      return res.status(400).json({ error: 'latexCode is required and must be a string.' });
    }
    if (!assignmentName || typeof assignmentName !== 'string') {
      return res.status(400).json({ error: 'assignmentName is required and must be a string.' });
    }
    if (!dueDate || typeof dueDate !== 'string') {
      return res.status(400).json({ error: 'dueDate is required and must be a string.' });
    }

    // Create and save the new assignment
    const newDoc = new AssignmentCode({
      classCode,
      latexCode,
      assignmentName,
      dueDate,
    });

    await newDoc.save();

    res.status(201).json({
      message: 'Assignment document created successfully.',
      document: newDoc,
    });
  } catch (err) {
    res.status(500).json({
      error: 'Failed to create assignment document.',
      details: err.message,
    });
  }
});
router.get('/object/id/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid MongoDB ObjectId' });
    }

    const assignment = await AssignmentCode.findById(id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json(assignment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch assignment by ID', details: err.message });
  }
});


module.exports = router;