// bpp/routes/on_search.js
const express = require('express');
const router = express.Router();
const Station = require('../models/Station');
const axios = require('axios');

function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRad = (val) => (val * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

router.post('/on_search', async (req, res) => {
  try {
    console.log('📥 Full BPP /on_search payload:', JSON.stringify(req.body, null, 2));

    const { intent } = req.body.message || {};
    console.log('🧠 Extracted intent:', JSON.stringify(intent, null, 2));

    const rawName = intent?.item?.descriptor?.name;
    const name = rawName?.toLowerCase() || null;

    const rawCity = intent?.provider?.descriptor?.name;
    const city = rawCity?.toLowerCase() || null;

    const gps = intent?.fulfillment?.end?.location?.gps || "12.9716,77.5946";
    const radius = parseFloat(intent?.fulfillment?.end?.location?.radius) || 10;
    const [userLat, userLon] = gps.split(',').map(Number);

    // Fetch all stations
    const allStations = await Station.find({});

    // Filter stations
    const filteredStations = allStations.filter((station) => {
      const matchName = name ? station?.name?.toLowerCase().includes(name) : true;
      const matchCity = city ? station?.address?.toLowerCase().includes(city) : true;

      // Optional: location-based filtering (disabled unless station lat/lon are added to DB)
      return matchName && matchCity;
    });

    console.log("✅ Found `${filteredStations.length}` matching stations");

    // Send to BAP callback
    await axios.post('http://192.168.29.243:5000/beckn/on_search_callback', {
      stations: filteredStations,
    });

    res.json({ message: 'Stations sent to BAP.' });
  } catch (err) {
    console.error('❌ BPP on_search error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;