const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const connectDB = require('./config/db');
const scheduleRoutes = require('./routes/scheduleRoutes.js');
const latexRoutes = require('./routes/LatexRoutes.js');

const app = express();
const PORT = process.env.PORT || 6000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/schedule', scheduleRoutes);

app.use('/api/latex', latexRoutes);

// Test Route
app.get('/test-connection', (req, res) => {
  res.json({ status: 'MongoDB Connected' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
