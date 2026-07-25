'use client';

import { useEffect, useState, useCallback } from 'react';
import { getFigures } from '@/lib/api';
import FigureCard from '@/components/FigureCard';

const CATEGORIES = ['Aktor', 'Musisi', 'Atlet', 'Pengusaha', 'Influencer', 'Politisi', 'Lainnya'];

export default function HomePage() {
  const [figures, setFigures] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFigures = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getFigures({ search: search || undefined, category: category || undefined });
      setFigures(res.data.data);
    } catch (err) {
      setError('Gagal memuat data. Pastikan backend sedang berjalan.');
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    const timeout = setTimeout(fetchFigures, 400); // debounce search
    return () => clearTimeout(timeout);
  }, [fetchFigures]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Daftar Figur Populer</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Cari nama figur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-slate-300 rounded-lg px-4 py-2"
        >
          <option value="">Semua Kategori</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-slate-500">Memuat data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && figures.length === 0 && (
        <p className="text-slate-500">Belum ada data figur. Tambahkan lewat API atau Swagger.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {figures.map((figure) => (
          <FigureCard key={figure._id} figure={figure} />
        ))}
      </div>
    </div>
  );
}
