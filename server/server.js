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


const searchRoute = require('./beckn/routes/search');
const onsearchRoute = require('./beckn/routes/on_search');

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


app.use('/beckn', searchRoute);
app.use('/beckn', onsearchRoute);

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