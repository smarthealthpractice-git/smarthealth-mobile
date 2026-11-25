import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenWrapper from '../../components/ScreenWrapper';
import colors from '../../utils/colors';

//password update: connect to backend: with auth password change api 
//no password verify: Require the existing password before allowing a password change.
//No password validation: Enforce password strength and confirmation; backend must enforce it too.
//No error/success handling: Add safe responses once the API is implemented.
//Backend must invalidate old sessions/tokens after password change: Verify this when implementing the backend endpoint. 

const SettingsScreen = ({ navigation }) => {
  return (
    <ScreenWrapper safeAreaStyle={{ backgroundColor: colors.primaryLight }}>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
	  <TouchableOpacity
          style={[styles.card, styles.linkCard]}
          onPress={() => navigation.navigate('DoctorAccess')}>
          <Text style={styles.linkText}>Doctor access</Text>
          <Ionicons name="chevron-forward" size={20} 		color={colors.textDark} />
        </TouchableOpacity>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="New password"
            placeholderTextColor={colors.inactive}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm password"
            placeholderTextColor={colors.inactive}
            secureTextEntry
          />

          <TouchableOpacity style={styles.outlineButton}>
            <Text style={styles.outlineButtonText}>Update password</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  title: { fontSize: 18, fontWeight: '700', color: colors.textDark },
  content: { padding: 16 },
    linkCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
  },
  linkText: { fontSize: 16, fontWeight: '600', color: colors.textDark },
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 12,
    elevation: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    color: colors.textDark,
  },
  outlineButton: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 6,
  },
  outlineButtonText: {
    color: colors.primary,
    fontWeight: '700',
  },
});

export default SettingsScreen;