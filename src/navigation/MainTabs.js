import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();

// Temporary screens (we replace later)
const SummaryScreen = () => <Text>Summary</Text>;
const HomeScreen = () => <Text>Home</Text>;
const FAQScreen = () => <Text>FAQ</Text>;

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#836FFF',
      }}
    >
      <Tab.Screen name="Summary" component={SummaryScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="FAQ" component={FAQScreen} />
    </Tab.Navigator>
  );
}