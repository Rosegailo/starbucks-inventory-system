const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const { ensureStaticBranchUser } = require('./utils/seedUsers');

// Load environment variables
dotenv.config();

// Initialize MongoDB Connection and ensure static branch user if empty
connectDB().then(() => {
  ensureStaticBranchUser().catch((err) => {
    console.error('Warning: Could not initialize branch user:', err.message);
  });
});

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve static assets (logo, etc.)
app.use('/assets', express.static(path.join(__dirname, '../')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Starbucks Inventory Management API'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// 404 Handler for undefined API routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Starbucks Inventory Server running on http://localhost:${PORT}`);
  console.log(`📡 API Endpoints: http://localhost:${PORT}/api/products`);
});
