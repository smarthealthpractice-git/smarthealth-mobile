import apiClient from '../api/apiClient';

// The signed-in patient's approved doctors (and the clinic of each).
export const getMyDoctors = async () => {
  const response = await apiClient.get('/api/me/doctors');
  return response.data;
};

export const getAvailability = async ({ doctorId, practiceId, date }) => {
  const response = await apiClient.get('/api/appointments/availability', {
    params: {
      doctorId,
      practiceId,
      date,
    },
  });

  return response.data;
};

export const bookAppointment = async ({
  doctorId,
  practiceId,
  startUtc,
  endUtc,
  paymentMode,
}) => {
  const response = await apiClient.post('/api/appointments/book', {
    doctorId,
    practiceId,
    startUtc,
    endUtc,
    paymentMode,
  });

  return response.data;
};