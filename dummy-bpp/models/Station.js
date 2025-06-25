const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  booked: { type: Boolean, default: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
});

const typeSchema = new mongoose.Schema({
  typeName: { type: String, required: true },   // Type1, Type2, Type3
  kwh: { type: Number, required: true },         // Power capacity
  pricePerHour: { type: Number, required: true } // Price per hour in INR
}, { _id: false }); // No _id for subdocuments if you don't need it

const chargingPointSchema = new mongoose.Schema({
  pointNumber: { type: Number, required: true },
  slots: [slotSchema],
  types: [typeSchema] // Reusing typeSchema
});

const stationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  latitude: { type: Number, required: true },       // Add this
  longitude: { type: Number, required: true },      // Add this
  chargingPoints: [chargingPointSchema],
  types: [typeSchema],
  payeeVPA: { type: String, required: true },
  payeeName: { type: String, required: true }
});

module.exports = mongoose.model("Station", stationSchema);