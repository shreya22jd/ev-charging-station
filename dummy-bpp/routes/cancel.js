// dummy-bpp/routes/on_cancel.js
const express = require("express");
const router = express.Router();
const Station = require("../../models/Station"); // Mongoose model
const { verifySignature, signPayload } = require("../../utils/signature");

router.post("/", async (req, res) => {
  try {
    const isValid = await verifySignature(req.body);
    if (!isValid) return res.status(401).json({ message: "Invalid signature" });

    const { context, message } = req.body;
    const { stationId, pointNumber, startTime, endTime } = message.cancel;

    const station = await Station.findById(stationId);
    if (!station) return res.status(404).json({ message: "Station not found!" });

    const point = station.chargingPoints.find(p => p.pointNumber === pointNumber);
    if (!point) return res.status(404).json({ message: "Charging point not found!" });

    const slot = point.slots.find(
      s => new Date(s.startTime).getTime() === new Date(startTime).getTime() &&
           new Date(s.endTime).getTime() === new Date(endTime).getTime() &&
           s.booked
    );

    if (!slot) return res.status(400).json({ message: "Matching booked slot not found." });

    // Release logic
    slot.booked = false;
    slot.userId = null;
    await station.save();

    const responsePayload = await signPayload({
      context: {
        ...context,
        action: "on_cancel",
        timestamp: new Date().toISOString()
      },
      message: {
        ack: { status: "ACK" },
        info: {
          releasedSlot: { stationId, pointNumber, startTime, endTime }
        }
      }
    });

    // Send back to BAP consumer
    await axios.post("http://192.168.29.243:4001/beckn/on_cancel", responsePayload);
    res.status(200).json({ message: "Slot released and ACK sent" });
  } catch (err) {
    console.error("on_cancel error:", err.message);
    res.status(500).json({ message: "Server error in on_cancel" });
  }
});

module.exports = router;
