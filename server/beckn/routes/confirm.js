const express = require("express");
const router = express.Router();
const axios = require("axios");
const { signPayload } = require('../utils/signer');
router.post("/confirm", async (req, res) => {
  console.log("✅ /beckn/confirm route loaded");

  try {
    const payload = req.body;

    // ✅ Patch: Ensure context exists
    if (!payload.context) {
      payload.context = {};
    }

    payload.context.action = "confirm";
    payload.context.timestamp = new Date().toISOString();

    const signedPayload = signPayload(payload.message);

    console.log("Sending confirm request to BPP at: http://192.168.29.243:4001/confirm");

    await axios.post("http://192.168.29.243:4001/confirm", {
      ...payload,
      signature: signedPayload
    });

    res.status(200).json({ ack: "Confirm request sent to BPP" });

  } catch (err) {
    console.error("Error in BAP /confirm:", err.response?.status, err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
