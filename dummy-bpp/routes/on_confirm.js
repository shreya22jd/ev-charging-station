const express = require("express");
const router = express.Router();
const { signPayload } = require("../utils/signer");

router.post("/", (req, res) => {
  const { context, message } = req.body;

  if (!context || !message || !message.booking) {
    return res.status(400).json({ error: "Missing booking or context" });
  }

  const booking = message.booking;
  const billAmount = booking.billAmount;

  const payload = {
    context: {
      ...context,
      action: "on_confirm",
      timestamp: new Date().toISOString()
    },
    message: {
      ack: {
        status: "ACK"
      },
      booking
    },
    billAmount // <---- Add it here at root level too
  };

  const signature = signPayload(payload);

  res.json({
    ...payload,
    signature
  });
});

module.exports = router;
