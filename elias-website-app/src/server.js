const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors()); // allow cross-origin requests

// URL-encode password special chars, e.g. "Toth3cloud!" -> "Toth3cloud%21"
const username = 'eliasmeanawebsite';
const password = encodeURIComponent('Toth3cloud!'); // encode special chars here
const cluster = 'cluster0.lfmofjr.mongodb.net';

const uri = `mongodb+srv://${username}:${password}@${cluster}/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri)
mongoose.connect(uri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const classSchema = new mongoose.Schema({}, { strict: false });
const Class = mongoose.model('Class', classSchema);

app.get('/api/schedule', async (req, res) => {
    try {
        const classes = await Class.find({});
        res.json(classes);
    } catch (err) {
        console.error('Error fetching schedule:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
