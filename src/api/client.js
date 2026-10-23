import axios from 'axios';
import { readSession } from '../utils/session';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const session = readSession();
  if (session) config.headers.Authorization = `Bearer ${session.token}`;
  return config;
});

export default api;
