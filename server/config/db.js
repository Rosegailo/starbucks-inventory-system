const dns = require('dns');
// Configure reliable public DNS servers for Windows SRV record resolution
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore if restricted
}

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/starbucks_inventory');
    console.log(`☕ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`💡 Tip: Ensure MongoDB service is running locally ('mongod' or Services -> MongoDB) or configure a valid Atlas URI in server/.env`);
    process.exit(1);
  }
};

module.exports = connectDB;
