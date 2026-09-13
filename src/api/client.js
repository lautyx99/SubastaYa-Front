import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5188/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request (después sirve para JWT)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response (manejo básico de errores)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // más adelante: redirigir a login
      console.warn('No autorizado');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
