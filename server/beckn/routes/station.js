const express = require('express');
const router = express.Router();
const Station = require('../../models/Station'); // Make sure this is correct

router.get('/stationCall', async (req, res) => {
    try {
        const stations = await Station.find(); // Or some other logic
        res.json(stations);
    } catch (err) {
        console.error('Error fetching stations:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
