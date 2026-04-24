import axios from 'axios';
import { getToken } from '../services/sessionService';

const BASE_URL = 'https://smart-health-backend-eksb.onrender.com/';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async config => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers['Cache-Control'] = 'no-cache';
    config.headers.Pragma = 'no-cache';

    return config;
  },
  error => Promise.reject(error),
);

export default apiClient;