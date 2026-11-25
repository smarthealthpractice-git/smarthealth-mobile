import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../utils/colors';
import ScreenWrapper from '../../components/ScreenWrapper';
import { getSession, clearSession } from '../../services/sessionService';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  getMe,
  getMyDiagnoses,
  getMyMedications,
  getMyExams,
  getMyVaccines,
} from '../../services/patientService';

const CARD_DATA = [
  { title: 'Diagnoses', icon: 'clipboard-outline' },
  { title: 'Allergies', icon: 'alert-circle-outline' },
  { title: 'Medications', icon: 'medkit-outline' },
  { title: 'Exams', icon: 'document-text-outline' },
  { title: 'Vaccines', icon: 'bandage-outline' },
  { title: 'My Practice', icon: 'ellipsis-horizontal' },
];

const PRACTICE_ITEMS = [
  'Appointment',
  'Order results',
  'Letter form',
  'Update request',
  'Medical Certificates',
];

const HomeScreen = () => {
  const navigation = useNavigation();

  const [patientId, setPatientId] = useState(null);
  const [displayName, setDisplayName] = useState('Patient');

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalItems, setModalItems] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const loadSession = async () => {
        try {
          const session = await getSession();
          setPatientId(session?.myPatientId ?? null);
          setDisplayName(session?.displayName || 'Patient');
        } catch (error) {
          console.log('LOAD SESSION ERROR:', error);
        }
      };

      loadSession();
    }, []),
  );

  const forceLogoutToLogin = async () => {
    try {
      await clearSession();
    } catch (error) {
      console.log('CLEAR SESSION ERROR:', error);
    }

    navigation.reset({
      index: 0,
      routes: [{ name: 'Onboarding' }],
    });
  };

  const openListModal = (title, items) => {
    setModalTitle(title);
    setModalItems(items);
    setModalVisible(true);
  };

  const formatDiagnoses = diagnoses => {
    if (!Array.isArray(diagnoses) || diagnoses.length === 0) {
      return ['No diagnoses'];
    }

    return diagnoses.map(diagnosis => {
      const title =
        diagnosis?.name ||
        diagnosis?.displays?.icd10 ||
        diagnosis?.icd10 ||
        diagnosis?.snomed?.[0] ||
        'Diagnosis';
//patient id- exposed
//api errors- logged with response data : remove from console.log
//session data: local load:async stroage 
// practice actions: placeholders? check when features implemented 
// patient id: read from local storage: not to rely for auth -- derive from jwt-pid
//modals: exposes health info: make sure backend endpoints only get auth patient info 
      const codes = [
        diagnosis?.icd10 ? `ICD-10 ${diagnosis.icd10}` : null,
        diagnosis?.snomed?.[0] ? `SNOMED ${diagnosis.snomed[0]}` : null,
      ]
        .filter(Boolean)
        .join(' | ');

      return codes ? `• ${title} — ${codes}` : `• ${title}`;
    });
  };

  const handleApiError = error => {
    console.log('Failed to load patient data');

    if (error?.response?.status === 401) {
      forceLogoutToLogin();
      return true;
    }

    return false;
  };

  const handleCardPress = async title => {
    if (title === 'My Practice') {
      openListModal('My Practice', PRACTICE_ITEMS);
      return;
    }

    setLoading(true);

    try {
      if (title === 'Diagnoses') {
        const diagnoses = await getMyDiagnoses();
        openListModal('Diagnoses', formatDiagnoses(diagnoses));
      }

      if (title === 'Allergies') {
        const me = await getMe();
        const allergies = me?.allergies?.trim()
          ? [`• ${me.allergies}`]
          : ['No allergies'];
        openListModal('Allergies', allergies);
      }

      if (title === 'Medications') {
        const medications = await getMyMedications();
        const items =
          Array.isArray(medications) && medications.length > 0
            ? medications.map(item => `• ${item}`)
            : ['No medications'];
        openListModal('Medications', items);
      }

      if (title === 'Exams') {
        const exams = await getMyExams();
        const items =
          Array.isArray(exams) && exams.length > 0
            ? exams.map(item => `• ${item}`)
            : ['No exams'];
        openListModal('Exams', items);
      }

      if (title === 'Vaccines') {
        const vaccines = await getMyVaccines();
        const items =
          Array.isArray(vaccines) && vaccines.length > 0
            ? vaccines.map(item => `• ${item}`)
            : ['No vaccines'];
        openListModal('Vaccines', items);
      }
    } catch (error) {
      const handled = handleApiError(error);
      if (!handled) {
        openListModal('Error', [
            'Unable to load this information. Please try again later.',
       ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePracticeItemPress = item => {
    setModalVisible(false);

    if (item === 'Appointment') {
      navigation.navigate('Appointment');
      return;
    }

    openListModal(item, [`Coming soon: ${item}`]);
  };

  return (
    <ScreenWrapper
      safeAreaStyle={{ backgroundColor: colors.primaryLight }}
      edges={[]}
    >
      <>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.greeting}>
            Hello, {displayName}
          </Text>

          <Text style={styles.subtitle}>Your Health Overview</Text>

          <View style={styles.grid}>
            {CARD_DATA.map(item => (
              <TouchableOpacity
                key={item.title}
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => handleCardPress(item.title)}
                disabled={loading}
              >
                <Ionicons
                  name={item.icon}
                  size={34}
                  color={colors.primary}
                  style={styles.cardIcon}
                />
                <Text style={styles.cardText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
        </ScrollView>

        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable style={styles.backdrop} onPress={() => setModalVisible(false)}>
            <Pressable style={styles.sheet} onPress={() => {}}>
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitle}>{modalTitle}</Text>

              <ScrollView showsVerticalScrollIndicator={false}>
                {modalTitle === 'My Practice'
                  ? modalItems.map(item => (
                      <TouchableOpacity
                        key={item}
                        style={styles.sheetRowButton}
                        onPress={() => handlePracticeItemPress(item)}
                      >
                        <Text style={styles.sheetRowButtonText}>{item}</Text>
                      </TouchableOpacity>
                    ))
                  : modalItems.map((item, index) => (
                      <View key={`${item}-${index}`} style={styles.sheetRow}>
                        <Text style={styles.sheetRowText}>{item}</Text>
                      </View>
                    ))}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      </>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryLight,
  },
  contentContainer: {
    padding: 22,
    paddingTop: 22,
    paddingBottom: 120,
    flexGrow: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  card: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 24,
    minHeight: 128,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 60,
    elevation: 4,
  },
  cardIcon: {
    marginBottom: 10,
  },
  cardText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.28)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    maxHeight: '70%',
  },
  sheetHandle: {
    width: 44,
    height: 5,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 14,
    textAlign: 'center',
  },
  sheetRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  sheetRowText: {
    fontSize: 15,
    color: colors.textDark,
    lineHeight: 22,
  },
  sheetRowButton: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  sheetRowButtonText: {
    fontSize: 15,
    color: colors.textDark,
    fontWeight: '600',
  },
});

export default HomeScreen;