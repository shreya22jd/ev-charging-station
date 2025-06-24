const express = require('express');
const Station = require('../models/Station');
const { signPayload } = require('../utils/signer');
const router = express.Router();

router.post('/on_search', async (req, res) => {
    try {
        const stations = await Station.find();

        const payload = { message: "Dummy BPP on_search response", stations };
        const signature = signPayload(payload);

        res.json({ payload, signature });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
