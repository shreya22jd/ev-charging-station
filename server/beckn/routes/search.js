// const express = require('express');
// const axios = require('axios');
// const { verifyPayload } = require('../utils/signer');
// const router = express.Router();

// router.post('/search', async (req, res) => {
//     try {
//         const response = await axios.post('http://192.168.29.243:4001/on_search', req.body);

//         const { payload, signature } = response.data;

//         const isValid = verifyPayload(payload, signature);

//         if (!isValid) {
//             return res.status(400).json({ message: "Invalid Signature!" });
//         }

//         res.json(payload);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// module.exports = router;


// bap/routes/search.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/search', async (req, res) => {
  const { name, city, distance } = req.body;

  const becknSearchPayload = {
    context: {
      domain: "mobility",
      action: "search",
      version: "1.0.0",
      bap_id: "bap.example.com",
      bap_uri: "http://192.168.29.243:5000/beckn",
      transaction_id: Date.now().toString(),
      message_id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    },
    message: {
      intent: {
        item: { descriptor: { name } },
        provider: { descriptor: { name: city } },
        fulfillment: {
          end: {
            location: {
              gps: "12.9716,77.5946", // Placeholder for user location
              radius: `${distance || 5}`,
            },
          },
        },
      },
    },
  };

  try {
    await axios.post('http://192.168.29.243:4001/on_search', becknSearchPayload);
    res.json({ status: 'Search sent to BPP' });
  } catch (error) {
    console.error("❌ Error sending search to BPP:", error.message);
    res.status(500).json({ error: 'Failed to send search' });
  }
});

module.exports = router;