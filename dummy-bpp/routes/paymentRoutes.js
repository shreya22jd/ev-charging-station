// const express = require('express');
// const router = express.Router();

// let transactions = []; // In-memory store for demonstration

// router.post('/init', (req, res) => {
//   const { order } = req.body;
//   console.log("Received init with order:", order);

//   const paymentTerms = {
//     uri: "payto://dummybank/1234567890?amount=INR:200",
//     tl_method: "PAYTO",
//     type: "ON-ORDER",
//     status: "NOT-PAID",
//     params: {
//       value: "200",
//       currency: "INR"
//     }
//   };

//   res.json({
//     message: "Received init successfully",
//     paymentTerms
//   });
// });

// router.post('/bill', (req, res) => {
//   const billData = req.body;
//   console.log('Received bill from client:', billData);

//   // Save transaction
//   transactions.push({
//     id: `txn_${Date.now()}`,
//     billData,
//     status: 'BILL_RECEIVED'
//   });

//   res.status(200).json({ message: 'Bill received successfully.' });
// });

// router.post('/confirmBill', (req, res) => {
//   const { billId } = req.body;
//   console.log("Received confirmBill request for billId:", billId);

//   // Update status in transactions
//   const txn = transactions.find(txn => txn.billData.message.billId === billId);
//   if (txn) {
//     txn.status = 'PAID';
//     txn.confirmData = { billId };
//   }

//   res.status(200).json({
//     message: "Bill confirmed and payment successful!",
//     paymentStatus: "PAID",
//     billId: billId || "dummy-bill-id",
//     amount: "200",
//     currency: "INR"
//   });
// });

// router.get('/history', (req, res) => {
//   res.status(200).json(transactions);
// });

// module.exports = router;
// dummy-bpp/routes/paymentRoutes.js

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const crypto = require('crypto');

// Mock transaction history
const transactionHistory = [];

// Util: Create a base64-encoded payload
const createBase64Payload = (obj) => {
  return Buffer.from(JSON.stringify(obj)).toString('base64');
};

// Util: Mock signature generation (replace with real HMAC when using real API)
const generateMockSignature = () => {
  return 'MOCK_SIGNATURE###MOCK_KEY';
};

// Initiate Bill Payment (simulate PhonePe request)
router.post('/initiate-bill', (req, res) => {
  try {
    const { bill } = req.body;

    // Validate bill
    if (!bill) {
      console.error('Missing bill object in request body.');
      return res.status(400).json({ message: 'Missing bill object in request body.' });
    }

    if (!bill.amount || isNaN(bill.amount)) {
      console.error('Invalid or missing amount in bill:', bill.amount);
      return res.status(400).json({ message: 'Invalid or missing amount in bill.' });
    }

    if (!bill.userId) {
      console.error('Missing userId in bill.');
      return res.status(400).json({ message: 'Missing userId in bill.' });
    }

    // Generate a unique transaction ID
    const transactionId = uuidv4();

    // Construct the payment request (PhonePe-like structure)
    const paymentRequest = {
      merchantId: 'MOCK_MERCHANT_ID',
      merchantTransactionId: transactionId,
      amount: bill.amount * 100, // paise
      merchantUserId: bill.userId,
      callbackUrl: `https://mock-bpp-server.com/payment-callback/${transactionId}`,
      mobileNumber: '9999999999', // mock mobile number
      paymentInstrument: {
        type: 'UPI_INTENT'
      }
    };

    const payloadBase64 = createBase64Payload(paymentRequest);
    const xVerify = generateMockSignature();

    // Mocked PhonePe response
    const mockPhonePeResponse = {
      success: true,
      data: {
        merchantTransactionId: transactionId,
        instrumentResponse: {
          type: 'UPI_INTENT',
          intentUrl: `upi://pay?pa=mock@upi&pn=EV+Charging&am=${bill.amount}&tn=EV+Charging+Payment`
        },
        status: 'PENDING'
      }
    };

    // Save to transaction history
    const transaction = {
      transactionId,
      bill,
      paymentRequest,
      status: 'INITIATED',
      paymentResponse: mockPhonePeResponse.data,
      createdAt: new Date().toISOString()
    };
    transactionHistory.push(transaction);

    console.log('Initiated Transaction:', transaction);

    res.status(200).json({
      context: {
        transaction_id: transactionId,
        message_id: uuidv4(),
        timestamp: new Date().toISOString(),
        action: 'on_payment'
      },
      message: {
        transaction_id: transactionId,
        payment: {
          status: 'INITIATED',
          phonepe: mockPhonePeResponse.data
        }
      }
    });
  } catch (error) {
    console.error('Error in /initiate-bill:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Confirm Bill Payment
router.post('/confirm-bill', async (req, res) => {
  try {
    const { transactionId } = req.body;

    const transaction = transactionHistory.find(t => t.transactionId === transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }

    // Update status
    transaction.status = 'SUCCESS';
    transaction.confirmedAt = new Date().toISOString();

    console.log('Confirmed Transaction:', transaction);

    // ✅ Send to BAP
    const bapUrl = process.env.BAP_URL || 'http://192.168.29.243:5000/beckn/transactions'; // fallback URL
    try {
      const bapResponse = await axios.post(bapUrl, transaction);
      console.log('✅ Sent to BAP:', bapResponse.data);
    } catch (bapError) {
      console.error('❌ Error sending to BAP:', bapError.message);
    }

    res.status(200).json({
      context: {
        transaction_id: transactionId,
        message_id: uuidv4(),
        timestamp: new Date().toISOString(),
        action: 'on_payment'
      },
      message: {
        transaction_id: transactionId,
        payment: {
          status: 'SUCCESS',
          phonepe: transaction.paymentResponse
        }
      }
    });
  } catch (error) {
    console.error('Error in /confirm-bill:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// View Transaction History
router.get('/transactions', (req, res) => {
  res.status(200).json(transactionHistory);
});

module.exports = router;
