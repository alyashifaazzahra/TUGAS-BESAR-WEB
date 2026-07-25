const express = require('express');
const router = express.Router();
const multer = require('multer');
const ctrl = require('../controllers/figure.controller');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Hanya file gambar yang diperbolehkan'));
  },
});

/**
 * @swagger
 * tags:
 *   name: Figures
 *   description: CRUD data tokoh/figur populer
 */

/**
 * @swagger
 * /api/figures:
 *   get:
 *     summary: Ambil daftar figur (support search & filter)
 *     tags: [Figures]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 12 }
 *     responses:
 *       200: { description: Berhasil }
 *   post:
 *     summary: Tambah figur baru
 *     tags: [Figures]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               category: { type: string }
 *               bio: { type: string }
 *     responses:
 *       201: { description: Berhasil dibuat }
 */
router.get('/', ctrl.getFigures);
router.post('/', ctrl.createFigure);

/**
 * @swagger
 * /api/figures/{id}:
 *   get:
 *     summary: Ambil detail satu figur
 *     tags: [Figures]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Berhasil }
 *       404: { description: Tidak ditemukan }
 *   put:
 *     summary: Update figur
 *     tags: [Figures]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Berhasil diupdate }
 *   delete:
 *     summary: Hapus figur
 *     tags: [Figures]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Berhasil dihapus }
 */
router.get('/:id', ctrl.getFigureById);
router.put('/:id', ctrl.updateFigure);
router.delete('/:id', ctrl.deleteFigure);

/**
 * @swagger
 * /api/figures/{id}/upload-image:
 *   post:
 *     summary: Upload foto profil figur ke MinIO
 *     tags: [Figures]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200: { description: Berhasil upload }
 */
router.post('/:id/upload-image', upload.single('image'), ctrl.uploadFigureImage);

module.exports = router;
