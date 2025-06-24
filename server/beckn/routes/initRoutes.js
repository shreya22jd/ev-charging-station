// // server/beckn/routes/initRoutes.js
// const express = require('express');
// const axios = require('axios');
// const router = express.Router();

// // Existing /bill route
// router.post('/bill', async (req, res) => {
//   const billData = req.body;
//   console.log('Received bill from client:', billData);

//   try {
//     console.log('Forwarding bill to BPP at http://192.168.29.243:4001/payment/bill');
//     const response = await axios.post('http://192.168.29.243:4001/payment/bill', billData);
//     console.log('Response from BPP:', response.data);
//     res.status(200).json({ message: 'Bill forwarded to BPP successfully.', data: response.data });
//   } catch (err) {
//     console.error('Error forwarding bill to BPP:', err.message);
//     res.status(500).json({ error: 'Failed to forward bill to BPP.' });
//   }
// });

// // 🆕 New confirmBill route
// router.post('/confirmBill', async (req, res) => {
//   const confirmData = req.body;
//   console.log('Received confirmBill from client:', confirmData);

//   try {
//     // Forward to BPP
//     console.log('Forwarding confirmBill to BPP at http://192.168.29.243:4001/payment/confirmBill');
//     const response = await axios.post('http://192.168.29.243:4001/payment/confirmBill', confirmData);
//     console.log('Response from BPP:', response.data);
//     res.status(200).json({ message: 'ConfirmBill forwarded to BPP successfully.', data: response.data });
//   } catch (err) {
//     console.error('Error forwarding confirmBill to BPP:', err.message);
//     res.status(500).json({ error: 'Failed to forward confirmBill to BPP.' });
//   }
// });

// module.exports = router;

// server/beckn/routes/initRoutes.js

const express = require('express');
const router = express.Router();
const axios = require('axios');

// BPP base URL
const BPP_BASE_URL = 'http://192.168.29.243:4001';

// Initiate Payment
router.post('/initiate-payment', async (req, res) => {
  try {
    const response = await axios.post(`${BPP_BASE_URL}/payment/initiate-bill`, req.body);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error initiating payment:', error.message);
    res.status(500).json({ message: 'Failed to initiate payment.' });
  }
});

// Confirm Payment
router.post('/confirm-payment', async (req, res) => {
  try {
    const response = await axios.post(`${BPP_BASE_URL}/payment/confirm-bill`, req.body);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error confirming payment:', error.message);
    res.status(500).json({ message: 'Failed to confirm payment.' });
  }
});

module.exports = router;
