const Schedule = require('../models/Schedule');

const getAllSchedules = async (req, res) => {
  try {
    const data = await Schedule.find({});
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllSchedules,
};
