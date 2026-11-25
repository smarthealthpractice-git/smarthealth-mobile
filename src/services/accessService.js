import apiClient from '../api/apiClient';

// All requests (pending, approved, rejected, revoked) of the signed-in patient.
export const getMyAccessRequests = async () => {
  const response = await apiClient.get('/api/me/access-requests');
  return response.data;
};

export const approveAccessRequest = async id => {
  const response = await apiClient.post(
    `/api/patient-access-requests/${id}/approve`,
  );
  return response.data;
};

export const rejectAccessRequest = async id => {
  const response = await apiClient.post(
    `/api/patient-access-requests/${id}/reject`,
  );
  return response.data;
};

export const revokeAccessRequest = async id => {
  const response = await apiClient.post(
    `/api/patient-access-requests/${id}/revoke`,
  );
  return response.data;
};