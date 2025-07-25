const mongoose = require('mongoose');

const latexCodeSchema = new mongoose.Schema({
  latexCode : String,
  pageCode : String,
  assignmentName : String,
  dueDate : String
}, { collection: 'CLASS_ASSIGNMENTS' }); 
module.exports = mongoose.model('LatexCode', latexCodeSchema);