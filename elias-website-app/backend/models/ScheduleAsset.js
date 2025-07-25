const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  name: String,
  link: String
});

const timeslotSchema = new mongoose.Schema({
  days: String,
  start_time: String,
  end_time: String,
  location: String
});

const scheduleAssetSchema = new mongoose.Schema({
  type: String,
  start_date: String,
  end_date: String,
  timeslots: [timeslotSchema],
  professor: String,
  course_page: String,
  textbooks: [String],
  syllabus: String,
  assignments: [assignmentSchema]
}, { collection: 'SCHEDULE_ASSETS' }); // 👈 important

module.exports = mongoose.model('ScheduleAsset', scheduleAssetSchema);
