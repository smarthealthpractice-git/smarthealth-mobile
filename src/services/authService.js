import apiClient from '../api/apiClient';

export const loginPatient = async ({ username, password }) => {
  const response = await apiClient.post('/api/auth/login', { //endpoint has https connection between app and endpoint -- check the apiClient.js
    username,
    password, //backend check needed (how password is returned)
  }); //what happens to returned token? 

  return response.data;
};

/*High: Backend authentication endpoint needs verification.
High: Backend must securely validate credentials and issue the token.
Related: Token storage weakness was identified in sessionService.js, not here.
*/