import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import colors from '../../utils/colors';
import ScreenWrapper from '../../components/ScreenWrapper';

import { getSession, clearSession } from '../../services/sessionService';
import { getMe, getMyDiagnoses } from '../../services/patientService';

import { buildSummaryHtml } from '../../utils/summaryHtml';
import { printHtml } from '../../services/printService';

const SummaryScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [header, setHeader] = useState('Summary');
  const [sections, setSections] = useState([]);

  const forceLogoutToLogin = async () => {
    try {
      await clearSession();
    } catch (e) {}

    navigation.reset({
      index: 0,
      routes: [{ name: 'Onboarding' }],
    });
  };

  const formatDiagnoses = diagnoses => {
    if (!Array.isArray(diagnoses) || diagnoses.length === 0) return [];

    return diagnoses.map(d => {
      const title =
        d?.name ||
        d?.displays?.icd10 ||
        d?.icd10 ||
        d?.snomed?.[0] ||
        'Diagnosis';

      const codes = [
        d?.icd10 ? `ICD-10 ${d.icd10}` : null,
        d?.snomed?.[0] ? `SNOMED ${d.snomed[0]}` : null,
      ]
        .filter(Boolean)
        .join(' | ');

      return codes ? `${title} — ${codes}` : title;
    });
  };

  const buildSections = (me, diagnoses) => {
    const result = [];

    const diag = formatDiagnoses(diagnoses);
    if (diag.length) result.push({ title: 'Diagnoses', lines: diag });

    if (me?.allergies?.trim()) {
      result.push({ title: 'Allergies', lines: [me.allergies] });
    }

    if (Array.isArray(me?.medications) && me.medications.length) {
      result.push({ title: 'Medications', lines: me.medications });
    }

    if (Array.isArray(me?.exams) && me.exams.length) {
      result.push({ title: 'Exams', lines: me.exams });
    }

    if (Array.isArray(me?.vaccines) && me.vaccines.length) {
      result.push({ title: 'Vaccines', lines: me.vaccines });
    }

    if (result.length === 0) {
      result.push({ title: 'Summary', lines: ['No data'] });
    }

    return result;
  };

  const loadSummary = useCallback(async () => {
    setLoading(true);

    try {
      const session = await getSession();
      const patientId = session?.myPatientId;

      if (!patientId) {
        setSections([{ title: 'Summary', lines: ['Missing patient session'] }]);
        return;
      }

      setHeader(`Summary • You (Patient #${patientId})`);

      const [me, diagnoses] = await Promise.all([
        getMe(),
        getMyDiagnoses(),
      ]);

      setSections(buildSections(me, diagnoses));
    } catch (error) {
      console.log('SUMMARY ERROR:', error);

      if (error?.response?.status === 401) {
        forceLogoutToLogin();
        return;
      }

      setSections([
        {
          title: 'Error',
          lines: [error?.message || 'Failed to load summary'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSummary();
    }, [loadSummary]),
  );

  const handlePrint = async () => {
    try {
      const session = await getSession();
      const patientId = session?.myPatientId;

      if (!patientId) {
        Alert.alert('Error', 'Missing patient ID');
        return;
      }

      if (!sections || sections.length === 0) {
        Alert.alert('Error', 'No summary data to export');
        return;
      }

      const html = buildSummaryHtml(header, patientId, sections);

      await printHtml(`Patient_Summary_${patientId}`, html);
    } catch (error) {
      console.log('PRINT ERROR:', error);
      Alert.alert(
        'Print error',
        error?.message || 'Failed to open print dialog',
      );
    }
  };

  return (
    <ScreenWrapper
      safeAreaStyle={{ backgroundColor: colors.primaryLight }}
      edges={[]}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>{header}</Text>

        <TouchableOpacity
          style={styles.printButton}
          activeOpacity={0.8}
          onPress={handlePrint}
        >
          <Text style={styles.printButtonText}>PRINT / SAVE PDF</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          sections.map(section => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>

              {section.lines.map((line, i) => (
                <Text key={`${section.title}-${i}`} style={styles.line}>
                  • {line}
                </Text>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

export default SummaryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryLight,
  },
  contentContainer: {
    padding: 18,
    paddingTop: 18,
    paddingBottom: 40,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 10,
  },
  printButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  printButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#BDBDBD',
    marginBottom: 14,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    color: colors.textDark,
  },
  line: {
    fontSize: 16,
    marginBottom: 4,
    color: colors.textDark,
  },
});