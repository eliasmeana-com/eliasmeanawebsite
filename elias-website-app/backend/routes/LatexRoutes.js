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

module.exports = router;