const mongoose = require('mongoose');
const Station = require('./models/Station'); // Corrected Model
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected for seeding Dummy BPP stations"))
.catch(err => console.log("❌ DB Connection Error:", err));

const externalStations = [
    {
        name: 'Green Charge Station',
        address: 'Sector 22, Noida',
        payeeVPA: 'greencharge@upi',
        payeeName: 'Green Charge Pvt Ltd',
        types: [
            { typeName: 'Type1', kwh: 22, pricePerHour: 150 },
            { typeName: 'Type2', kwh: 50, pricePerHour: 300 }
        ],
        chargingPoints: [
            {
                pointNumber: 1,
                types: [
                    { typeName: 'Type1', kwh: 22, pricePerHour: 150 }
                ],
                slots: [] // Initially empty slots
            },
            {
                pointNumber: 2,
                types: [
                    { typeName: 'Type2', kwh: 50, pricePerHour: 300 }
                ],
                slots: []
            }
        ]
    },
    {
        name: 'FastCharge EV Hub',
        address: 'Hitech City, Hyderabad',
        payeeVPA: 'fastcharge@upi',
        payeeName: 'FastCharge Solutions',
        types: [
            { typeName: 'Type2', kwh: 50, pricePerHour: 280 },
            { typeName: 'Type3', kwh: 100, pricePerHour: 500 }
        ],
        chargingPoints: [
            {
                pointNumber: 1,
                types: [
                    { typeName: 'Type2', kwh: 50, pricePerHour: 280 }
                ],
                slots: []
            },
            {
                pointNumber: 2,
                types: [
                    { typeName: 'Type3', kwh: 100, pricePerHour: 500 },
                    {
                        typeName: "Type3",
                        kwh: 100,
                        pricePerHour: 400
                      }
                ],
                slots: []
            }
        ]
    },
    {
        name: 'EcoVolt Charging',
        address: 'MG Road, Bengaluru',
        payeeVPA: 'ecovolt@upi',
        payeeName: 'EcoVolt Charging Ltd',
        types: [
            { typeName: 'Type1', kwh: 22, pricePerHour: 140 },
            { typeName: 'Type3', kwh: 100, pricePerHour: 520 }
        ],
        chargingPoints: [
            {
                pointNumber: 1,
                types: [
                    { typeName: 'Type1', kwh: 22, pricePerHour: 140 }
                ],
                slots: []
            },
            {
                pointNumber: 2,
                types: [
                    { typeName: 'Type3', kwh: 100, pricePerHour: 520 }
                ],
                slots: []
            }
        ]
    }
];

const seedDB = async () => {
    await Station.deleteMany({});
    await Station.insertMany(externalStations);
    console.log("✅ Dummy BPP Stations Seeded Successfully!");
    mongoose.connection.close();
};

seedDB();
