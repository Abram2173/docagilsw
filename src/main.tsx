import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import './styles/globals.css';

// ← FIX: Axios global con token auto en todas calls
import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// ← FIX: Logout solo en 401 real (no en errores normales)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {  // Solo 401 (unauth), no otros errors
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/auth?tab=login';
    }
    return Promise.reject(error);
  }
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);