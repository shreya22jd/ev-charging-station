const express = require('express');
const axios = require('axios');
const { verifyPayload } = require('../utils/signer');
const router = express.Router();

router.post('/search', async (req, res) => {
    try {
        const response = await axios.post('http://192.168.29.243:4001/on_search', req.body);

        const { payload, signature } = response.data;

        const isValid = verifyPayload(payload, signature);

        if (!isValid) {
            return res.status(400).json({ message: "Invalid Signature!" });
        }

        res.json(payload);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
