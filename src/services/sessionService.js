import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

const STORAGE_KEYS = {
  role: 'role',
  myPatientId: 'myPatientId',
  displayName: 'displayName',
  email: 'email',
};

const KEYCHAIN_SERVICE = 'smarthealth-auth';

export const saveSession = async ({
  token,
  role,
  myPatientId,
  displayName,
  email,
}) => {
  try { 
    await Keychain.setGenericPassword(
    'smarthealth-user',
    String(token ?? ''),
    {
      service: KEYCHAIN_SERVICE,
    },
  );

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

  } catch (error) {
    console.log('SAVE SESSION ERROR');
    throw new Error('Failed to save session');
  }
};

export const clearSession = async () => {
let keychainCleared = false;
let storageCleared = false;

try {
await Keychain.resetGenericPassword({
service: KEYCHAIN_SERVICE,
});
keychainCleared = true;
} catch (error) {
console.log('Failed to clear secure session');
}

try {
await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
storageCleared = true;
} catch (error) {
console.log('Failed to clear session metadata');
}

if (!keychainCleared || !storageCleared) {
throw new Error('Failed to completely clear session');
}
};


export const getToken = async () => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: KEYCHAIN_SERVICE,
    });

    if (!credentials) {
      return null;
    }

    return credentials.password;
  } catch (error) {
    return null;
  }
};

export const getSession = async () => {
  try {
    const token = await getToken();
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
    return null;
    
  }
};