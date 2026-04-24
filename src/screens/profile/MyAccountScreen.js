import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenWrapper from '../../components/ScreenWrapper';
import colors from '../../utils/colors';

const fields = [
  'First name',
  'Last name',
  'Email',
  'Phone',
  'Address line 1',
  'Address line 2 (optional)',
  'City',
  'Eircode',
  'Medical card number',
];

const MyAccountScreen = ({ navigation }) => {
  return (
    <ScreenWrapper safeAreaStyle={{ backgroundColor: colors.primaryLight }}>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.title}>My account</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          {fields.map(label => (
            <TextInput
              key={label}
              style={styles.input}
              placeholder={label}
              placeholderTextColor={colors.inactive}
            />
          ))}

          <TouchableOpacity style={styles.outlineButton}>
            <Text style={styles.outlineButtonText}>Save changes</Text>
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

export default MyAccountScreen;