const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Gagal koneksi MongoDB: ${error.message}`);
    // Retry setelah 5 detik, berguna saat container mongodb belum siap
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;
