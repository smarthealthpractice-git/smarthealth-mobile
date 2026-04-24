import apiClient from '../api/apiClient';

export const getMe = async () => {
  const response = await apiClient.get('/api/me');
  return response.data;
};

export const getMyDiagnoses = async () => {
  const response = await apiClient.get('/api/me/diagnoses');
  return response.data;
};

export const getMyMedications = async () => {
  const response = await apiClient.get('/api/me/medications');
  return response.data;
};

export const getMyExams = async () => {
  const response = await apiClient.get('/api/me/exams');
  return response.data;
};

export const getMyVaccines = async () => {
  const response = await apiClient.get('/api/me/vaccines');
  return response.data;
};