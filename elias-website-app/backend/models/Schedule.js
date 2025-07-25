const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  day: String,
  timeRange: String,
  location: String,
  campus: String,
  instructor: String,
  description: String,
  courseHomePage: String,
});

const scheduleSchema = new mongoose.Schema({
  className: String,
  startDate: String,
  endDate: String,
  times: [timeSlotSchema],
});

module.exports = mongoose.model('Schedule', scheduleSchema);
