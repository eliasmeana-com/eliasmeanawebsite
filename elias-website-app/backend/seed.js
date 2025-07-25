const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Schedule = require('./models/Schedule');
const scheduleData = require('./scheduleData.json'); // put your JSON here

dotenv.config();

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Schedule.deleteMany(); // clear existing
    await Schedule.insertMany(scheduleData.scheduleData);

    console.log('Data Imported');
    process.exit();
  } catch (err) {
    console.error('Import failed:', err);
    process.exit(1);
  }
};

importData();
