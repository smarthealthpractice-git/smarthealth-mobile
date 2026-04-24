import React from 'react';
import { StyleSheet, View, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ScreenWrapper = ({ children, style, safeAreaStyle, edges = ['top'] }) => {
  const androidTopInset = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

  return (
    <SafeAreaView style={[styles.safeArea, safeAreaStyle]} edges={edges}>
      <View
  	style={[
    	  styles.content,
    	  edges.includes('top') ? { paddingTop: androidTopInset } : null,
          style,
        ]}
>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default ScreenWrapper;