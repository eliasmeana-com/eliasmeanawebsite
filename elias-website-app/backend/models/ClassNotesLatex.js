const mongoose = require('mongoose');

const classNoteSchema = new mongoose.Schema({
  latexCode : String,
  pageCode : String
}, { collection: 'CLASS_NOTES' }); 
module.exports = mongoose.model('LatexCode', classNoteSchema);
