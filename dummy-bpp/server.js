const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const onSearchRouter = require('./routes/on_search');
const onSelectRouter = require('./routes/on_select');
const onInitRouter = require('./routes/on_init');
const onConfirmRouter = require('./routes/on_confirm');
const confirmRoutes = require('./routes/confirm');  // Importing your confirm routes

const app = express();
app.use(bodyParser.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected for Dummy BPP"))
  .catch(err => console.error('❌ MongoDB Connection Error for Dummy BPP:', err));

// ✅ Routes with Specific Paths
app.use('/', onSearchRouter);
app.use('/beckn/on_select', onSelectRouter);
app.use('/beckn/on_init', onInitRouter);
app.use('/beckn/on_confirm', onConfirmRouter);
const paymentRoutes = require('./routes/paymentRoutes');
app.use('/payment', paymentRoutes);


// Use the confirm route at /beckn/confirm
app.use('/', confirmRoutes);

// Optional: Adding middleware for logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🚀 Dummy BPP Running");
});

// ✅ Start Server
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Dummy BPP running on port ${PORT}`);
});