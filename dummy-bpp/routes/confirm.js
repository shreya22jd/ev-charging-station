const express = require("express");
const router = express.Router();
const axios = require("axios");
const Station = require("../models/Station");
const { signPayload } = require('../utils/signer');

router.post("/confirm", async (req, res) => {
  try {
    const { context, message } = req.body;
    const { provider, items, billing, fulfillment } = message.order;

    const stationId = provider?.id;
    const userId = billing?.userId;
    const pointNumber = fulfillment?.start?.point?.id; // ✅ FIXED: Read point number correctly
    const typeName = items?.[0]?.id;
    const startTime = new Date(fulfillment?.start?.time?.timestamp);
    const endTime = new Date(fulfillment?.end?.time?.timestamp);

    if (!stationId || !userId || !pointNumber || startTime >= endTime) {
      return res.status(400).json({ error: "Invalid booking data" });
    }

    const station = await Station.findById(stationId);
    if (!station) return res.status(404).json({ error: "Station not found" });

    const chargingPoint = station.chargingPoints.find(p => p.pointNumber === Number(pointNumber));
    if (!chargingPoint) return res.status(404).json({ error: "Charging point not found" });

    const overlap = chargingPoint.slots?.some(slot =>
      startTime < new Date(slot.endTime) && endTime > new Date(slot.startTime)
    );
    if (overlap) return res.status(400).json({ error: "Time slot is already booked" });

    const selectedType = chargingPoint.types.find(t => t.typeName === typeName);
    if (!selectedType) return res.status(400).json({ error: "Invalid charging type" });

    const hours = (endTime - startTime) / (1000 * 60 * 60);
    const billAmount = hours * selectedType.pricePerHour;

    chargingPoint.slots.push({ startTime, endTime, booked: true, userId });
    station.markModified("chargingPoints");
    await station.save();

    const bookingPayload = {
      message: "Slot booked",
      station_id: stationId,
      pointNumber,
      slot: { startTime, endTime },
      selectedType,
      billAmount,
      payeeVPA: station.payeeVPA,
      payeeName: station.payeeName
    };

    const signed = signPayload(bookingPayload);

    await axios.post("http://localhost:5000/beckn/on_confirm", {
      context: {
        ...context,
        action: "on_confirm",
        timestamp: new Date().toISOString()
      },
      message: {
        ack: { status: "ACK" },
        booking: bookingPayload
      },
      signature: signed
    });

    res.status(200).json({ ack: "Booking confirmed and /on_confirm sent to BAP" });
  } catch (err) {
    console.error("Error in BPP /confirm:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
