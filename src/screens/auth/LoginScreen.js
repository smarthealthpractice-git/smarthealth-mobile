import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from 'react-native';
import colors from '../../utils/colors';
import { loginPatient } from '../../services/authService';
import { saveSession } from '../../services/sessionService';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const username = email.trim().toLowerCase();

    if (!username || !password.trim()) {
      Alert.alert('Missing fields', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const res = await loginPatient({
        username,
        password,
      });

      if (String(res.role).toLowerCase() !== 'patient') {
        Alert.alert('Access denied', 'This app is for patients only.');
        return;
      }

      if (!res.patientId) {
        Alert.alert('Login error', 'Missing patient ID from server.');
        return;
      }

      if (!res.token) {
        Alert.alert('Login error', 'Server did not return a token.');
        return;
      }

      await saveSession({
        token: res.token,
        role: 'patient',
        myPatientId: res.patientId,
        displayName: res.name || username,
        email: username,
      });

      navigation.replace('MainTabs');
    } catch (error) {
      console.log('LOGIN ERROR FULL:', error);
      console.log('LOGIN ERROR RESPONSE:', error?.response?.data);
      console.log('LOGIN ERROR MESSAGE:', error?.message);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Unknown error';

      Alert.alert('Login failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/onboarding_bg.png')}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Login to your account</Text>

          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#666666"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.primaryButtonText}>LOGIN</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            disabled={loading}
          >
            <Text style={styles.linkText}>Go to Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.white,
    borderRadius: 28,
    paddingHorizontal: 28,
    paddingVertical: 32,
    elevation: 8,
    transform: [{ translateY: 150 }],
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  backArrow: {
    fontSize: 22,
    color: colors.textDark,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 12,
    color: colors.textDark,
    backgroundColor: colors.white,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    minHeight: 50,
  },
  disabledButton: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  linkText: {
    marginTop: 16,
    textAlign: 'center',
    color: colors.primaryDark,
    fontWeight: '600',
  },
});

export default LoginScreen;