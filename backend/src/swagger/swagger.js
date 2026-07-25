const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tugas Besar API - Platform Figur Populer',
      version: '1.0.0',
      description:
        'RESTful API untuk mengelola data tokoh/figur populer, upload gambar ke MinIO, dan integrasi AI Ollama kampus.',
    },
    servers: [
      { url: '/', description: 'Server saat ini' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
