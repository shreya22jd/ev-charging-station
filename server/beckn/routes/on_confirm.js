// const express = require("express");
// const router = express.Router();

// router.post("/on_confirm", async (req, res) => {
//   try {
//     const { context, message, signature } = req.body;

//     console.log("Received /on_confirm:");
//     console.log("Context:", context);
//     console.log("Booking Message:", message);
//     console.log("Signature:", signature);

//   const billAmount = message?.booking?.billAmount;  // Accessing billAmount under booking object
//     console.log("Bill Amount:", billAmount); 
//     // You may validate signature here if needed

//     // Optional: relay to frontend via WebSocket or event store
//     res.status(200).json({ ack: "Received /on_confirm from BPP" });
//   } catch (err) {
//     console.error("Error in BAP /on_confirm:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();

router.post("/on_confirm", async (req, res) => {
  try {
    const { context, message, signature } = req.body;

    console.log("✅ Received /on_confirm:");
    console.log("Context:", context);
    console.log("Booking Message:", message);
    console.log("Signature:", signature);

    const billAmount = message?.booking?.billAmount;

    if (billAmount !== undefined) {
      console.log("💰 Bill Amount:", billAmount);

      // Send to WebSocket clients
      req.io.emit("billAmountUpdate", { billAmount });
    }

    res.status(200).json({ ack: "✅ Received /on_confirm from BPP" });
  } catch (err) {
    console.error("❌ Error in BAP /on_confirm:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
