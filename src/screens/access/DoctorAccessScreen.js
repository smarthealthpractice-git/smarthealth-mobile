import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenWrapper from '../../components/ScreenWrapper';
import colors from '../../utils/colors';
import {
  getMyAccessRequests,
  approveAccessRequest,
  rejectAccessRequest,
  revokeAccessRequest,
} from '../../services/accessService';

const STATUS_LABEL = {
  pending: 'Waiting for your decision',
  approved: 'Access allowed',
  rejected: 'Declined',
  revoked: 'Access removed',
};

const DoctorAccessScreen = ({ navigation }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoadError(false);
      const data = await getMyAccessRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch (e) {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load]),
  );

  const runAction = async (id, action) => {
    if (busyId) return;
    setBusyId(id);
    try {
      await action(id);
      await load();
    } catch (e) {
      Alert.alert('Something went wrong', 'Please try again.');
    } finally {
      setBusyId(null);
    }
  };

  const confirmAction = (title, message, id, action) => {
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes', onPress: () => runAction(id, action) },
    ]);
  };

  const sorted = [...requests].sort(
    (a, b) => (b.status === 'pending') - (a.status === 'pending'),
  );

  const renderActions = item => {
    const disabled = busyId !== null;

    if (item.status === 'pending') {
      return (
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton, disabled && styles.disabled]}
            disabled={disabled}
            onPress={() =>
              confirmAction(
                'Allow access?',
                `${item.doctorName} (${item.practiceName}) will be able to see your records and appointments.`,
                item.id,
                approveAccessRequest,
              )
            }>
            <Text style={styles.primaryButtonText}>Allow</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.outlineButton, disabled && styles.disabled]}
            disabled={disabled}
            onPress={() =>
              confirmAction(
                'Decline request?',
                `${item.doctorName} will not get access to your records.`,
                item.id,
                rejectAccessRequest,
              )
            }>
            <Text style={styles.outlineButtonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (item.status === 'approved') {
      return (
        <TouchableOpacity
          style={[styles.button, styles.dangerButton, disabled && styles.disabled]}
          disabled={disabled}
          onPress={() =>
            confirmAction(
              'Remove access?',
              `${item.doctorName} will immediately lose access to your records.`,
              item.id,
              revokeAccessRequest,
            )
          }>
          <Text style={styles.dangerButtonText}>Remove access</Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <ScreenWrapper safeAreaStyle={{ backgroundColor: colors.primaryLight }}>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.title}>Doctor access</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : loadError ? (
          <View style={styles.card}>
            <Text style={styles.message}>Could not load your requests.</Text>
            <TouchableOpacity
              style={[styles.button, styles.outlineButton]}
              onPress={() => {
                setLoading(true);
                load();
              }}>
              <Text style={styles.outlineButtonText}>Try again</Text>
            </TouchableOpacity>
          </View>
        ) : sorted.length === 0 ? (
          <View style={styles.card}>
            <Text style={styles.message}>
              No doctor has asked for access to your records yet.
            </Text>
          </View>
        ) : (
          sorted.map(item => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.doctor}>{item.doctorName}</Text>
              <Text style={styles.practice}>{item.practiceName}</Text>
              <Text style={styles.status}>
                {STATUS_LABEL[item.status] || item.status}
              </Text>
              {renderActions(item)}
            </View>
          ))
        )}
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
    padding: 16,
    marginBottom: 12,
    elevation: 4,
  },
  doctor: { fontSize: 16, fontWeight: '700', color: colors.textDark },
  practice: { fontSize: 14, color: colors.textDark, marginTop: 2 },
  status: { fontSize: 13, color: colors.inactive, marginTop: 6, marginBottom: 10 },
  message: { fontSize: 14, color: colors.textDark, marginBottom: 8 },
  row: { flexDirection: 'row' },
  button: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  primaryButton: { backgroundColor: colors.primary },
  primaryButtonText: { color: colors.white, fontWeight: '700' },
  outlineButton: { borderWidth: 1.5, borderColor: colors.primary },
  outlineButtonText: { color: colors.primary, fontWeight: '700' },
  dangerButton: { borderWidth: 1.5, borderColor: '#B3261E' },
  dangerButtonText: { color: '#B3261E', fontWeight: '700' },
  disabled: { opacity: 0.5 },
});

export default DoctorAccessScreen;