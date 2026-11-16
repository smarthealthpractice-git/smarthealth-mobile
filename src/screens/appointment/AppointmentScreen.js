import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import { DatePickerModal } from 'react-native-paper-dates';
import { useFocusEffect } from '@react-navigation/native';
import colors from '../../utils/colors';
import ScreenWrapper from '../../components/ScreenWrapper';
import { getAvailability, getMyDoctors } from '../../services/appointmentService';

const AppointmentScreen = ({ navigation, route }) => {
  const [selectedDate, setSelectedDate] = useState(getTodayIso());
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState([]);
  const [open, setOpen] = useState(false);

  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState(null);	

//test needed with unauth user-- see what happens
  const prettyDate = useMemo(() => formatPrettyDate(selectedDate), [selectedDate]);

//no auth check overall?
    const loadSlots = useCallback(
    async date => {
      if (!doctor) {
        setSlots([]);
        return;
      }
      setLoading(true);
      try {
        const data = await getAvailability({
          doctorId: doctor.doctorId,
          practiceId: doctor.practiceId,
          date,
        });
        setSlots(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log('LOAD SLOTS ERROR');
        Alert.alert(
          'Failed to load slots',
          error?.response?.data?.message || error?.message || 'Unknown error',
        );
        setSlots([]);
      } finally {
        setLoading(false);
      }
    },
    [doctor],
  );

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const list = await getMyDoctors();
        setDoctors(Array.isArray(list) ? list : []);
        if (Array.isArray(list) && list.length > 0) {
          setDoctor(list[0]);
        }
      } catch (error) {
        Alert.alert(
          'Failed to load doctors',
          error?.response?.data?.message || error?.message || 'Unknown error',
        );
      }
    };
    loadDoctors();
  }, []);

  useEffect(() => {
    loadSlots(selectedDate);
  }, [selectedDate, loadSlots]);

  useFocusEffect(
    useCallback(() => {
      if (route?.params?.refreshSlots) {
        loadSlots(selectedDate);
        navigation.setParams({ refreshSlots: false });
      }
    }, [route?.params?.refreshSlots, selectedDate, loadSlots, navigation]),
  );

  const onDismissSingle = () => {
    setOpen(false);
  };

  const onConfirmSingle = params => {
    setOpen(false);

    if (!params?.date) {
      return;
    }

    const picked = toIsoDate(params.date);
    setSelectedDate(picked);
  };

    const handleSlotPress = slot => {
    if (!doctor) {
      return;
    }
    navigation.navigate('ConfirmAppointment', {
      slot,
      selectedDate,
      prettyDate,
      slotLabel: formatLocalTime(slot.startUtc),
      doctorId: doctor.doctorId,
      practiceId: doctor.practiceId,
    });
  };

  return (
    <ScreenWrapper safeAreaStyle={{ backgroundColor: colors.primaryLight }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate('MainTabs');
      }
  }}
>
  <Text style={styles.backArrow}>←</Text>
</TouchableOpacity>

        <Text style={styles.dateTitle}>{prettyDate}</Text>
        <Text style={styles.subtitle}>Select a time slot</Text>

        <TouchableOpacity
          style={styles.selectDateButton}
          onPress={() => setOpen(true)}
        >

        <Text style={styles.subtitle}>
          Doctor: {doctor ? doctor.name : 'none approved yet'}
        </Text>
        {doctors.length > 1 &&
          doctors.map(d => (
            <TouchableOpacity
              key={`${d.doctorId}-${d.practiceId}`}
              style={styles.selectDateButton}
              onPress={() => setDoctor(d)}
            >
              <Text style={styles.selectDateButtonText}>{d.name}</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.selectDateButtonText}>Select date</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          {loading ? (
            <View style={styles.centeredState}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : slots.length === 0 ? (
            <View style={styles.centeredState}>
              <Text style={styles.emptyText}>No timetables available for that day</Text>
            </View>
          ) : (
            slots.map((slot, index) => (
              <TouchableOpacity
                key={`${slot.startUtc}-${index}`}
                style={styles.slotButton}
                onPress={() => handleSlotPress(slot)}
              >
                <Text style={styles.slotText}>{formatLocalTime(slot.startUtc)}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <DatePickerModal
        locale="en-GB"
        mode="single"
        visible={open}
        onDismiss={onDismissSingle}
        date={fromIsoDate(selectedDate)}
        onConfirm={onConfirmSingle}
        saveLabel="Done"
        label="Select date"
      />
    </ScreenWrapper>
  );
};

const getTodayIso = () => {
  const now = new Date();
  return toIsoDate(now);
};

const toIsoDate = date => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const fromIsoDate = isoDate => {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const formatPrettyDate = isoDate => {
  try {
    const date = fromIsoDate(isoDate);
    return date.toLocaleDateString('en-IE', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoDate;
  }
};

const formatLocalTime = utcString => {
  try {
    const date = new Date(utcString);
    return date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).toUpperCase();
  } catch {
    return utcString;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryLight,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: 4,
    marginBottom: 8,
  },
  backArrow: {
    fontSize: 24,
    color: colors.textDark,
  },
  dateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textDark,
    textAlign: 'center',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textDark,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 14,
  },
  selectDateButton: {
    alignSelf: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 22,
    marginBottom: 14,
  },
  selectDateButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    elevation: 6,
  },
  centeredState: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textDark,
    fontSize: 15,
    textAlign: 'center',
  },
  slotButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: colors.white,
  },
  slotText: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default AppointmentScreen;