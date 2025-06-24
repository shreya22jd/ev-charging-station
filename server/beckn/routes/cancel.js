// beckn/routes/cancel.js
const express = require("express");
const router = express.Router();
const { signPayload } = require("../../utils/signature");
const axios = require("axios");

router.post("/", async (req, res) => {
  try {
    const { context, message } = req.body;

    // Sign and forward to BPP
    const signedPayload = await signPayload({ context, message });

    await axios.post("http://192.168.29.243:5000/on_bpp/cancel", signedPayload);

    res.status(200).json({ message: "Cancel request sent to BPP" });
  } catch (err) {
    console.error("Cancel Error:", err.message);
    res.status(500).json({ error: "Failed to send cancel request" });
  }
});

module.exports = router;
