const express = require('express');
const router = express.Router();
const Station = require('../../models/Station'); // Make sure the path is correct

// 🧾 GET station details by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const station = await Station.findById(id);

        if (!station) {
            return res.status(404).json({ error: 'Station not found' });
        }

        res.json(station);
    } catch (err) {
        console.error('Error fetching station:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
