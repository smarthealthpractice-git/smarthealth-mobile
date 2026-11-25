
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';

import ScreenWrapper from '../../components/ScreenWrapper';
import colors from '../../utils/colors';
import { bookAppointment } from '../../services/appointmentService';

const ConfirmAppointmentScreen = ({ route, navigation }) => {
    const { slot, prettyDate, slotLabel, selectedDate, doctorId, practiceId } = route.params || {};

 //taken from client supplied values can be manipulated 
  const [loading, setLoading] = useState(false);

  const handleConfirm = async paymentMode => {

	    if (!doctorId) {
      Alert.alert('Error', 'Missing doctor information');
      return;
    }

    if (!slot?.startUtc || !slot?.endUtc) {
      Alert.alert('Error', 'Missing slot information');
      return;
    }

    setLoading(true);

    try {
      await bookAppointment({
        doctorId,
	practiceId, 
        startUtc: slot.startUtc, //client controls appointment time xxx
        endUtc: slot.endUtc,
        paymentMode, //check must be there to validate if user is allowed to use med card 
      }); // avoids users from avoiding required payment when applicable 

      Alert.alert('Success', 'Appointment confirmed', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('Appointment', {
              refreshSlots: true,
              selectedDate,
            });
          }, //test req: no token? to book endpoint-- 401 unauth result
        },
      ]); // test req: valid pid.token? book endpoint: backend verify patient from jwt
    } catch (error) {
      console.log('BOOK APPOINTMENT ERROR'); 
      Alert.alert(
        'Booking failed',
        error?.response?.data?.message || error?.message || 'Unknown error',
      );
    } finally {
      setLoading(false);
    }
  };
//must not rely on UI to enforce price
  return (
    <ScreenWrapper safeAreaStyle={{ backgroundColor: colors.primaryLight }}>
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          <Text style={styles.toolbarTitle}>Confirm appointment</Text>

          <View style={styles.toolbarSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.centerBlock}>
            <Text style={styles.subtitle}>
              {prettyDate} • {slotLabel}
            </Text>

            <View style={styles.infoCard}>
              <Text style={styles.priceText}>€30 consultation fee</Text>
              <Text style={styles.hintText}> 
                Your saved payment details will be charged.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => handleConfirm('CARD')}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.primaryButtonText}>Pay €30 and confirm</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.outlineButton}
              onPress={() => handleConfirm('MEDCARD')}
              disabled={loading}
            >
              <Text style={styles.outlineButtonText}>I have a medical card</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryLight,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  toolbarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
  },
  toolbarSpacer: {
    width: 24,
  },
  backArrow: {
    fontSize: 24,
    color: colors.textDark,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingBottom: 120
  },
  centerBlock: {
    width: '100%',
    marginTop: -40,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 18,
    elevation: 4,
    marginBottom: 20,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
  },
  hintText: {
    fontSize: 13,
    color: '#777777',
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    marginBottom: 12,
    width: '100%',
  },
  primaryButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
  outlineButton: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: colors.white,
    width: '100%',
  },
  outlineButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 15,
  },
});

export default ConfirmAppointmentScreen;