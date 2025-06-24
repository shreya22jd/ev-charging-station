// beckn/routes/on_cancel.js
const express = require("express");
const router = express.Router();
const { verifySignature } = require("../../utils/signature");

const onCancelResponses = {}; // memory store per txn

router.post("/", async (req, res) => {
  try {
    const isValid = await verifySignature(req.body);
    if (!isValid) return res.status(401).json({ message: "Invalid signature" });

    const { context, message } = req.body;
    const txnId = context.transaction_id;
    onCancelResponses[txnId] = message;

    res.status(200).json({ message: "on_cancel ACK stored" });
  } catch (err) {
    console.error("on_cancel reception error:", err.message);
    res.status(500).json({ message: "Error storing on_cancel" });
  }
});

router.get("/:transactionId", (req, res) => {
  const { transactionId } = req.params;
  const message = onCancelResponses[transactionId];

  if (!message) {
    return res.status(404).json({ message: "No response for this transaction yet" });
  }

  res.status(200).json({ message });
});

module.exports = router;
