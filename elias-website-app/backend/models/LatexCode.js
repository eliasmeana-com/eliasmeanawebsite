const mongoose = require('mongoose');

const latexCodeSchema = new mongoose.Schema({
  latexCode : String,
  pageCode : String
}, { collection: 'LATEX_RAW_CODE' }); // 👈 important

module.exports = mongoose.model('LatexCode', latexCodeSchema);
