import apiClient from '../api/apiClient';

export const getAvailability = async ({ doctorId = 1, date }) => {
  const response = await apiClient.get('/api/appointments/availability', {
    params: {
      doctorId,
      date,
    },
  });

  return response.data;
};

export const bookAppointment = async ({
  doctorId = 1,
  startUtc,
  endUtc,
  paymentMode,
}) => {
  const response = await apiClient.post('/api/appointments/book', {
    doctorId,
    startUtc,
    endUtc,
    paymentMode,
  });

  return response.data;
};