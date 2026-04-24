import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenWrapper from '../../components/ScreenWrapper';
import colors from '../../utils/colors';

const MyPlanScreen = ({ navigation }) => {
  return (
    <ScreenWrapper safeAreaStyle={{ backgroundColor: colors.primaryLight }}>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.title}>My plan</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current plan</Text>
          <Text style={styles.text}>Plan details will be available here.</Text>
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
    padding: 16,
    elevation: 4,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: colors.textDark, marginBottom: 8 },
  text: { fontSize: 15, color: colors.textDark },
});

export default MyPlanScreen;