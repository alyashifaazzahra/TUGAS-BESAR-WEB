'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getFigureById, uploadFigureImage, summarizeFigure } from '@/lib/api';

export default function FigureDetailPage() {
  const { id } = useParams();
  const [figure, setFigure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [summary, setSummary] = useState('');
  const [summarizing, setSummarizing] = useState(false);
  const [error, setError] = useState(null);

  const fetchFigure = async () => {
    try {
      const res = await getFigureById(id);
      setFigure(res.data.data);
    } catch (err) {
      setError('Gagal memuat data figur.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchFigure();
  }, [id]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const res = await uploadFigureImage(id, formData);
      setFigure(res.data.data);
    } catch (err) {
      alert('Gagal upload gambar: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  const handleSummarize = async () => {
    setSummarizing(true);
    setSummary('');
    try {
      const res = await summarizeFigure(id);
      setSummary(res.data.data.summary);
    } catch (err) {
      alert('Gagal meringkas: ' + (err.response?.data?.message || err.message));
    } finally {
      setSummarizing(false);
    }
  };

  if (loading) return <p className="text-slate-500">Memuat...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!figure) return null;

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div>
        <div className="relative w-full h-64 bg-slate-100 rounded-xl overflow-hidden mb-3">
          {figure.profileImage?.url ? (
            <Image src={figure.profileImage.url} alt={figure.name} fill className="object-cover" unoptimized />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">Tidak ada gambar</div>
          )}
        </div>
        <label className="block">
          <span className="text-sm text-slate-600">Upload / ganti foto profil</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="block w-full text-sm mt-1"
          />
        </label>
        {uploading && <p className="text-sm text-slate-500 mt-1">Mengupload...</p>}
      </div>

      <div className="md:col-span-2">
        <h1 className="text-2xl font-bold text-slate-800">{figure.name}</h1>
        <span className="inline-block mt-1 mb-4 text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
          {figure.category}
        </span>
        <p className="text-slate-700 whitespace-pre-line">{figure.bio || 'Belum ada bio.'}</p>

        <div className="mt-6 border-t pt-4">
          <button
            onClick={handleSummarize}
            disabled={summarizing || !figure.bio}
            className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
          >
            {summarizing ? 'Meringkas dengan AI...' : '✨ Ringkas bio dengan AI'}
          </button>
          {summary && (
            <div className="mt-3 bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-700">
              {summary}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
