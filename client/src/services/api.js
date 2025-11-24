import axios from 'axios';

// Asegurarse de que la variable de entorno se lea correctamente
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

console.log('API URL configurada:', API_URL); // Para debugging

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;