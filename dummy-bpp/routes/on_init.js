const express = require('express');
const Station = require('../models/Station');
const { signPayload } = require('../utils/signer');
const router = express.Router();

router.post('/on_init', async (req, res) => {
    const { station_id } = req.body;

    try {
        const station = await Station.findById(station_id);
        if (!station || station.slotsAvailable <= 0) {
            return res.status(400).json({ message: "No slots available" });
        }

        const payload = {
            message: "Init successful",
            station_id,
            status: "INITIATED"
        };

        const signature = signPayload(payload);

        res.json({ payload, signature });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
