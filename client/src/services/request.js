import axios from 'axios';

const api = axios.create({
  baseURL: 'https://job-importer-project-backend.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
