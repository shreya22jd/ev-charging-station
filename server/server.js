// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const selectOneRoutes = require('./beckn/routes/selectone');
// const becknStationRoutes = require('./beckn/routes/station');
// const accountRoutes = require("./routes/account");
// const authRoutes = require('./routes/auth');
// const station=require("./routes/stationRoute.js")
// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => console.log('✅ MongoDB Connected'))
//   .catch(err => {
//       console.error('❌ MongoDB Connection Error:', err);
//       process.exit(1); // Exit on connection failure
//   });

// // Default route
// app.get('/', (req, res) => {
//     res.send('🚀 Server is running...');
// });

// // ✅ Use separate subpaths for each route file to avoid conflicts
// app.use('/beckn/station', becknStationRoutes);     // e.g. /beckn/station/call
// app.use('/beckn/selectone', selectOneRoutes);      // e.g. /beckn/selectone/trigger
// const confirmRoute = require("./beckn/routes/confirm");
// const onConfirmRoute = require("./beckn/routes/on_confirm");

// app.use("/beckn", confirmRoute);
// app.use("/beckn", onConfirmRoute);



// // Other API routes
// app.use("/api/account", accountRoutes);
// app.use("/api/auth", authRoutes);
// app.use('/api',station);
// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Dummy BAP running on port ${PORT}`);
// });


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const http = require('http');
const socketIo = require('socket.io');

const selectOneRoutes = require('./beckn/routes/selectone');
const becknStationRoutes = require('./beckn/routes/station');
const confirmRoute = require('./beckn/routes/confirm');
const onConfirmRoute = require('./beckn/routes/on_confirm');
const accountRoutes = require("./routes/account");
const authRoutes = require('./routes/auth');
const station = require("./routes/stationRoute.js");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // or your frontend URL
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.json());
app.use(cors());

// Inject io into request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// Default route
app.get('/', (req, res) => {
  res.send('🚀 Server is running...');
});

// API Routes
app.use('/beckn/station', becknStationRoutes);
app.use('/beckn/selectone', selectOneRoutes);
app.use('/beckn', confirmRoute);
app.use('/beckn', onConfirmRoute);
app.use('/api/account', accountRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', station);
const initRoutes = require('./beckn/routes/initRoutes');
app.use('/beckn', initRoutes);
const transactionRoutes = require('./beckn/routes/transactionRoutes');
app.use('/beckn', transactionRoutes);
// WebSocket connection
io.on("connection", (socket) => {
  console.log("✅ WebSocket client connected");

  socket.on("disconnect", () => {
    console.log("❌ WebSocket client disconnected");
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Dummy BAP running on port ${PORT}`);
});
