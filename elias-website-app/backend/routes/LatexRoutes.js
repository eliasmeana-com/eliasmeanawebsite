const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const LatexCode = require('../models/LatexCode');


router.get('/object/all', async (req, res) => {
  try {
    const assets = await LatexCode.find({});
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

    const updatedAsset = await LatexCode.findByIdAndUpdate(id, updates, {
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
module.exports = router;