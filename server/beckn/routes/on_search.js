const express = require('express');
const router = express.Router();

let latestStations = []; // Stores the most recent station list

// Endpoint called by the Dummy BPP
router.post('/on_search_callback', (req, res) => {
  latestStations = req.body.stations || [];
  console.log("✅ Received stations from BPP:", latestStations.length);
  latestStations.forEach((s, i) => {
    console.log(`➡️  ${i + 1}: ${s.name} - ${s.address}`);
  });
  res.status(200).json({ ack: true });
});

// Endpoint to retrieve the stored stations (for frontend/testing)
router.get('/get_latest', (req, res) => {
  res.json({ stations: latestStations });
});

module.exports = router;