import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Alert,
  View,
} from 'react-native';
import colors from '../../utils/colors';

const RegisterScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [eircode, setEircode] = useState('');
  const [medicalCardNumber, setMedicalCardNumber] = useState('');
  const [ppsNumber, setPpsNumber] = useState('');
  const [iban, setIban] = useState('');
  const [bic, setBic] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert('Missing fields', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password error', 'Passwords do not match');
      return;
    }

    navigation.replace('MainTabs');
  };

  const renderInput = (placeholder, value, setter, extraProps = {}) => (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#666666"
      value={value}
      onChangeText={setter}
      {...extraProps}
    />
  );

  return (
    <ImageBackground
      source={require('../../assets/images/onboarding_bg.png')}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Create an Account</Text>

            {renderInput('First Name', firstName, setFirstName)}
            {renderInput('Last Name', lastName, setLastName)}
            {renderInput('E-mail', email, setEmail, {
              autoCapitalize: 'none',
              keyboardType: 'email-address',
            })}
            {renderInput('Phone', phone, setPhone, {
              keyboardType: 'phone-pad',
            })}
            {renderInput('Address1', address1, setAddress1)}
            {renderInput('Address2', address2, setAddress2)}
            {renderInput('City', city, setCity)}
            {renderInput('Eircode', eircode, setEircode)}
            {renderInput('Medical Card Number', medicalCardNumber, setMedicalCardNumber)}
            {renderInput('PPS number', ppsNumber, setPpsNumber)}
            {renderInput('IBAN', iban, setIban, {
              autoCapitalize: 'characters',
            })}
            {renderInput('BIC', bic, setBic, {
              autoCapitalize: 'characters',
            })}
            {renderInput('Account Name', accountHolder, setAccountHolder)}
            {renderInput('Password', password, setPassword, {
              secureTextEntry: true,
            })}
            {renderInput('Confirm Password', confirmPassword, setConfirmPassword, {
              secureTextEntry: true,
            })}

            <TouchableOpacity style={styles.primaryButton} onPress={handleSignUp}>
              <Text style={styles.primaryButtonText}>SIGN UP</Text>
            </TouchableOpacity>
          </ScrollView>
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
    paddingVertical: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    maxHeight: '72%',
    backgroundColor: colors.white,
    borderRadius: 28,
    elevation: 8,
    transform: [{ translateY: 90 }],
    overflow: 'hidden',
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingVertical: 28,
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
    marginBottom: 12,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 10,
    color: colors.textDark,
    backgroundColor: colors.white,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default RegisterScreen;