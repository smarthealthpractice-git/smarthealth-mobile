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

/*Backend authorization is not visible here
High
Verify each endpoint only returns the authenticated patient's data.*/

/*No client-side authorization logic
Low
Fine; authorization should primarily be enforced by the backend. */