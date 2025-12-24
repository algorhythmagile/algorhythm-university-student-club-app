import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const addComment = (eventId, content) => api.post(`/events/${eventId}/comments`, { content });
export const getComments = (eventId) => api.get(`/events/${eventId}/comments`);
export const toggleLike = (eventId) => api.post(`/events/${eventId}/like`);
export const getLikes = (eventId) => api.get(`/events/${eventId}/likes`);

export default api;
