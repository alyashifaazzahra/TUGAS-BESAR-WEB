'use client';

import { useState } from 'react';
import { askAI } from '@/lib/api';

export default function AIPage() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setResponse('');
    try {
      const res = await askAI(prompt);
      setResponse(res.data.data.response);
    } catch (err) {
      setError('Gagal menghubungi AI kampus. Coba lagi beberapa saat.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Tanya AI Kampus</h1>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Tulis pertanyaan kamu..."
          className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Memproses...' : 'Kirim'}
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {response && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 whitespace-pre-line text-slate-700">
          {response}
        </div>
      )}
    </div>
  );
}
