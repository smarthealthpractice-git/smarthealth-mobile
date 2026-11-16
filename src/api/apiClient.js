import axios from 'axios';
import Config from 'react-native-config';
import { getToken } from '../services/sessionService';
//red flag below-- hardcoded url 
const BASE_URL = Config.API_BASE_URL;

if (!BASE_URL) {
  throw new Error('API_BASE_URL is missing from the environment configuration.');
}

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