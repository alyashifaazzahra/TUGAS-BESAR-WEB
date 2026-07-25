const Minio = require('minio');

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'minio',
  port: parseInt(process.env.MINIO_PORT) || 9000,
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'figure-images';

// Pastikan bucket ada saat server start, kalau belum ada -> buat + set public read
const initBucket = async () => {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
      console.log(`✅ Bucket "${BUCKET_NAME}" dibuat`);

      // Policy agar gambar bisa diakses publik lewat URL langsung
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
          },
        ],
      };
      await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
      console.log(`✅ Bucket policy publik di-set untuk "${BUCKET_NAME}"`);
    } else {
      console.log(`✅ Bucket "${BUCKET_NAME}" sudah ada`);
    }
  } catch (error) {
    console.error('❌ Gagal inisialisasi MinIO bucket:', error.message);
  }
};

module.exports = { minioClient, BUCKET_NAME, initBucket };
