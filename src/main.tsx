import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import './styles/globals.css';

// ← AGREGADO: Axios global para API calls
import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';  // ← FIX: Sin trailing /

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);