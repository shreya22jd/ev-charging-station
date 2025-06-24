const express = require('express');
const Station = require('../models/Station');
const router = express.Router();
const { signPayload } = require('../utils/signer');

router.post('/on_select', async (req, res) => {
    const { station_id } = req.body;

    try {
        const station = await Station.findById(station_id); // CORRECT: use findById not { id: station_id }
        if (!station) return res.status(404).json({ message: "Station not found" });

        const payload = { message: "Dummy BPP on_select response", station }; // CORRECT: station not stations
        const signature = signPayload(payload);

        res.json({ payload, signature });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
