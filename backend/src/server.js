require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { initBucket } = require('./config/minio');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await initBucket();

  app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    console.log(`📚 Swagger docs di http://localhost:${PORT}/api-docs`);
  });
};

startServer();
