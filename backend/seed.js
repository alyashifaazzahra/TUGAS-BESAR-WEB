// Script untuk isi ulang data figur secara otomatis
// Jalankan dengan: node seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Figure = require('./src/models/Figure');

const figures = [
  { name: "Raditya Dika", category: "Influencer", bio: "Penulis, sutradara, dan komedian asal Indonesia yang dikenal lewat buku-buku komedi dan konten YouTube tentang kehidupan sehari-hari." },
  { name: "Deddy Corbuzier", category: "Influencer", bio: "Mentalist, podcaster, dan mantan atlet bela diri yang kini dikenal lewat podcast wawancara dan konten edukasi kebugaran." },
  { name: "Awkarin", category: "Influencer", bio: "Konten kreator dan entrepreneur digital yang populer di media sosial sejak era awal influencer Indonesia." },
  { name: "Atta Halilintar", category: "Pengusaha", bio: "YouTuber dan pengusaha muda Indonesia, salah satu kreator konten dengan jumlah subscriber terbesar di Asia Tenggara." },
  { name: "Rachel Vennya", category: "Influencer", bio: "Selebgram dan pengusaha fashion yang aktif membagikan gaya hidup dan kegiatan bisnisnya di media sosial." },
  { name: "Reza Rahadian", category: "Aktor", bio: "Aktor film dan teater Indonesia yang telah membintangi puluhan judul film layar lebar sejak awal 2010-an." },
  { name: "Rich Brian", category: "Musisi", bio: "Rapper dan produser musik asal Indonesia yang meraih kesuksesan internasional lewat lagu-lagu hip-hop dalam bahasa Inggris." },
  { name: "Rio Haryanto", category: "Atlet", bio: "Pembalap asal Indonesia yang pernah menjadi pembalap Indonesia pertama di ajang Formula 1." },
  { name: "Susi Pudjiastuti", category: "Politisi", bio: "Mantan Menteri Kelautan dan Perikanan Indonesia yang dikenal lewat kebijakan tegas dan gaya komunikasi khasnya di media sosial." },
  { name: "Jerome Polin", category: "Influencer", bio: "YouTuber edukasi yang dikenal lewat konten matematika dan pengalaman kuliah di Jepang." },
  { name: "Arief Muhammad", category: "Pengusaha", bio: "Content creator dan pengusaha yang dikenal lewat channel keluarga POPS Ivan Gunawan dan bisnis kuliner." },
  { name: "Ria Ricis", category: "Influencer", bio: "Konten kreator dan YouTuber Indonesia yang dikenal lewat konten keluarga dan gaya hidup sehari-hari." },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    let created = 0, skipped = 0;
    for (const fig of figures) {
      const exists = await Figure.findOne({ name: fig.name });
      if (exists) {
        console.log(`⏭️  Skip (sudah ada): ${fig.name}`);
        skipped++;
      } else {
        await Figure.create(fig);
        console.log(`✅ Created: ${fig.name}`);
        created++;
      }
    }

    console.log(`\n🎉 Selesai! ${created} figur baru dibuat, ${skipped} dilewati (sudah ada).`);
    console.log('⚠️  Catatan: foto profil TIDAK ikut ter-restore lewat script ini, perlu upload ulang manual.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seed();
