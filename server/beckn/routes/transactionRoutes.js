const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Mock database for storing transactions
const transactionHistory = [];

// POST endpoint to receive confirmed transactions from BPP
router.post('/transactions', (req, res) => {
  try {
    const transaction = req.body;
    if (!transaction || !transaction.transactionId) {
      return res.status(400).json({ message: 'Invalid transaction data.' });
    }

    transactionHistory.push(transaction);
    console.log('✅ Transaction received and stored:', transaction);

    res.status(200).json({ message: 'Transaction stored successfully.' });
  } catch (error) {
    console.error('❌ Error in POST /transactions:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// GET endpoint to fetch all transactions (for History Page)
router.get('/transactions', (req, res) => {
  try {
    res.status(200).json(transactionHistory);
  } catch (error) {
    console.error('❌ Error in GET /transactions:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;
