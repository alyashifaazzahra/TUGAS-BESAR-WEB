const mongoose = require('mongoose');

const figureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Nama wajib diisi'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Aktor', 'Musisi', 'Atlet', 'Pengusaha', 'Influencer', 'Politisi', 'Lainnya'],
      default: 'Lainnya',
    },
    bio: {
      type: String,
      default: '',
    },
    nationality: {
      type: String,
      default: '',
    },
    birthDate: {
      type: Date,
    },
    profileImage: {
      // Menyimpan key/path object di MinIO, bukan file-nya langsung
      objectKey: { type: String, default: null },
      url: { type: String, default: null },
    },
    socialLinks: {
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      website: { type: String, default: '' },
    },
    tags: [{ type: String }],
    // Relasi antar figur, misal "sering berkolaborasi dengan"
    relatedFigures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Figure',
      },
    ],
  },
  { timestamps: true }
);

// Index untuk mempercepat fitur search/filter
figureSchema.index({ name: 'text', bio: 'text', tags: 'text' });
figureSchema.index({ category: 1 });

module.exports = mongoose.model('Figure', figureSchema);
