import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

export const getFigures = (params = {}) => api.get('/figures', { params });
export const getFigureById = (id) => api.get(`/figures/${id}`);
export const createFigure = (data) => api.post('/figures', data);
export const updateFigure = (id, data) => api.put(`/figures/${id}`, data);
export const deleteFigure = (id) => api.delete(`/figures/${id}`);
export const uploadFigureImage = (id, formData) =>
  api.post(`/figures/${id}/upload-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const askAI = (prompt) => api.post('/ai/generate', { prompt });
export const summarizeFigure = (figureId) => api.post(`/ai/summarize/${figureId}`);

export default api;
