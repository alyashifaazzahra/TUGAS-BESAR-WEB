const axios = require('axios');
const Figure = require('../models/Figure');

// POST /api/ai/generate
// Body: { prompt: string }
exports.generateText = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Field "prompt" wajib diisi' });
    }

    const response = await axios.post(
      process.env.OLLAMA_API_URL,
      {
        model: process.env.OLLAMA_MODEL || 'llama3',
        prompt,
        stream: false,
      },
      { timeout: 60000 }
    );

    res.status(200).json({
      success: true,
      data: {
        response: response.data.response,
        model: response.data.model,
      },
    });
  } catch (error) {
    console.error('Ollama error:', error.message);
    res.status(502).json({
      success: false,
      message: 'Gagal menghubungi layanan AI Ollama kampus',
      detail: error.response?.data || error.message,
    });
  }
};

// POST /api/ai/summarize/:figureId
// Meringkas bio figur menggunakan AI
exports.summarizeFigure = async (req, res) => {
  try {
    const figure = await Figure.findById(req.params.figureId);
    if (!figure) {
      return res.status(404).json({ success: false, message: 'Figur tidak ditemukan' });
    }
    if (!figure.bio) {
      return res.status(400).json({ success: false, message: 'Figur ini belum punya bio untuk diringkas' });
    }

    const prompt = `Ringkas biografi berikut ke dalam 2-3 kalimat berbahasa Indonesia yang padat dan jelas:\n\n${figure.bio}`;

    const response = await axios.post(
      process.env.OLLAMA_API_URL,
      {
        model: process.env.OLLAMA_MODEL || 'llama3',
        prompt,
        stream: false,
      },
      { timeout: 60000 }
    );

    res.status(200).json({
      success: true,
      data: { summary: response.data.response },
    });
  } catch (error) {
    console.error('Ollama error:', error.message);
    res.status(502).json({
      success: false,
      message: 'Gagal menghubungi layanan AI Ollama kampus',
      detail: error.response?.data || error.message,
    });
  }
};
