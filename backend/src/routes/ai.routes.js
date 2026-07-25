const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/ai.controller');

/**
 * @swagger
 * tags:
 *   name: AI
 *   description: Integrasi Ollama AI kampus
 */

/**
 * @swagger
 * /api/ai/generate:
 *   post:
 *     summary: Generate teks bebas menggunakan Ollama
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt: { type: string, example: "Jelaskan apa itu Next.js" }
 *     responses:
 *       200: { description: Berhasil }
 *       502: { description: Gagal menghubungi Ollama }
 */
router.post('/generate', ctrl.generateText);

/**
 * @swagger
 * /api/ai/summarize/{figureId}:
 *   post:
 *     summary: Ringkas bio seorang figur menggunakan AI
 *     tags: [AI]
 *     parameters:
 *       - in: path
 *         name: figureId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Berhasil }
 */
router.post('/summarize/:figureId', ctrl.summarizeFigure);

module.exports = router;
