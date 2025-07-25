const mongoose = require('mongoose');

const latexCodeSchema = new mongoose.Schema({
  latexCode : String,
  pageCode : String
}, { collection: 'CLAS_NOTES' }); 
module.exports = mongoose.model('LatexCode', latexCodeSchema);
