import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  token: 'token',
  role: 'role',
  myPatientId: 'myPatientId',
  displayName: 'displayName',
  email: 'email',
};

export const saveSession = async ({
  token,
  role,
  myPatientId,
  displayName,
  email,
}) => {
  try {
    console.log('SAVE SESSION INPUT:', {
      token,
      role,
      myPatientId,
      displayName,
      email,
    });

    await AsyncStorage.setItem(STORAGE_KEYS.token, String(token ?? ''));
    await AsyncStorage.setItem(STORAGE_KEYS.role, String(role ?? ''));
    await AsyncStorage.setItem(
      STORAGE_KEYS.myPatientId,
      myPatientId != null ? String(myPatientId) : '',
    );
    await AsyncStorage.setItem(
      STORAGE_KEYS.displayName,
      String(displayName ?? ''),
    );
    await AsyncStorage.setItem(STORAGE_KEYS.email, String(email ?? ''));

    console.log('SESSION SAVED OK');
  } catch (error) {
    console.log('SAVE SESSION ERROR:', error);
    throw new Error('Failed to save session');
  }
};

export const clearSession = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.token);
    await AsyncStorage.removeItem(STORAGE_KEYS.role);
    await AsyncStorage.removeItem(STORAGE_KEYS.myPatientId);
    await AsyncStorage.removeItem(STORAGE_KEYS.displayName);
    await AsyncStorage.removeItem(STORAGE_KEYS.email);
  } catch (error) {
    console.log('CLEAR SESSION ERROR:', error);
    throw new Error('Failed to clear session');
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.token);
  } catch (error) {
    console.log('GET TOKEN ERROR:', error);
    return null;
  }
};

export const getSession = async () => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.token);
    const role = await AsyncStorage.getItem(STORAGE_KEYS.role);
    const myPatientId = await AsyncStorage.getItem(STORAGE_KEYS.myPatientId);
    const displayName = await AsyncStorage.getItem(STORAGE_KEYS.displayName);
    const email = await AsyncStorage.getItem(STORAGE_KEYS.email);

    return {
      token: token || null,
      role: role || null,
      myPatientId: myPatientId ? Number(myPatientId) : null,
      displayName: displayName || null,
      email: email || null,
    };
  } catch (error) {
    console.log('GET SESSION ERROR:', error);
    throw new Error('Failed to load session');
  }
};