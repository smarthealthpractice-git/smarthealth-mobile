import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../utils/colors';

const FAQScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>FAQ</Text>
      <Text style={styles.subtitle}>FAQ screen placeholder</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textDark,
    textAlign: 'center',
  },
});

export default FAQScreen;