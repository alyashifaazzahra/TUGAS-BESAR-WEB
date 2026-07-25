const Figure = require('../models/Figure');
const { minioClient, BUCKET_NAME } = require('../config/minio');
const { v4: uuidv4 } = require('uuid');

// GET /api/figures?search=&category=&page=&limit=
exports.getFigures = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 12 } = req.query;
    const query = {};

    if (search) {
      query.$text = { $search: search };
    }
    if (category) {
      query.category = category;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [figures, total] = await Promise.all([
      Figure.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      Figure.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: figures,
      pagination: {
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/figures/:id
exports.getFigureById = async (req, res) => {
  try {
    const figure = await Figure.findById(req.params.id).populate('relatedFigures', 'name profileImage');
    if (!figure) {
      return res.status(404).json({ success: false, message: 'Figur tidak ditemukan' });
    }
    res.status(200).json({ success: true, data: figure });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/figures
exports.createFigure = async (req, res) => {
  try {
    const figure = await Figure.create(req.body);
    res.status(201).json({ success: true, data: figure });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/figures/:id
exports.updateFigure = async (req, res) => {
  try {
    const figure = await Figure.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!figure) {
      return res.status(404).json({ success: false, message: 'Figur tidak ditemukan' });
    }
    res.status(200).json({ success: true, data: figure });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/figures/:id
exports.deleteFigure = async (req, res) => {
  try {
    const figure = await Figure.findById(req.params.id);
    if (!figure) {
      return res.status(404).json({ success: false, message: 'Figur tidak ditemukan' });
    }

    // Hapus juga gambar di MinIO kalau ada
    if (figure.profileImage?.objectKey) {
      await minioClient.removeObject(BUCKET_NAME, figure.profileImage.objectKey).catch(() => {});
    }

    await figure.deleteOne();
    res.status(200).json({ success: true, message: 'Figur berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/figures/:id/upload-image
exports.uploadFigureImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Tidak ada file yang diupload' });
    }

    const figure = await Figure.findById(req.params.id);
    if (!figure) {
      return res.status(404).json({ success: false, message: 'Figur tidak ditemukan' });
    }

    // Hapus gambar lama kalau ada
    if (figure.profileImage?.objectKey) {
      await minioClient.removeObject(BUCKET_NAME, figure.profileImage.objectKey).catch(() => {});
    }

    const ext = req.file.originalname.split('.').pop();
    const objectKey = `figures/${uuidv4()}.${ext}`;

    await minioClient.putObject(BUCKET_NAME, objectKey, req.file.buffer, req.file.size, {
      'Content-Type': req.file.mimetype,
    });

    const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
    const publicUrl = `${protocol}://${process.env.MINIO_PUBLIC_HOST || req.get('host').split(':')[0] + ':' + process.env.MINIO_PORT}/${BUCKET_NAME}/${objectKey}`;

    figure.profileImage = { objectKey, url: publicUrl };
    await figure.save();

    res.status(200).json({ success: true, data: figure });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
