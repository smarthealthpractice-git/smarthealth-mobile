import apiClient from '../api/apiClient';

export const loginPatient = async ({ username, password }) => {
  const response = await apiClient.post('/api/auth/login', {
    username,
    password,
  });

  return response.data;
};