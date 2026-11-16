import React, { useState } from 'react';
import {
  TouchableOpacity,
  View,
  Modal,
  Pressable,
  Text,
  StyleSheet,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import colors from '../utils/colors';

import SummaryScreen from '../screens/summary/SummaryScreen';
import HomeScreen from '../screens/home/HomeScreen';
import FAQScreen from '../screens/faq/FAQScreen';

const Tab = createBottomTabNavigator();

const HeaderRightIcons = () => {
  const navigation = useNavigation();
  const [profileVisible, setProfileVisible] = useState(false);

  const openScreen = screenName => {
    setProfileVisible(false);
    navigation.navigate(screenName);
  };

  return (
    <>
      <View style={styles.headerIcons}>
        <TouchableOpacity
          onPress={() => console.log('Language pressed')}
          style={styles.headerIconButton}
        >
          <Ionicons name="globe-outline" size={22} color={colors.textDark} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setProfileVisible(true)}>
          <Ionicons name="person" size={22} color={colors.textDark} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={profileVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setProfileVisible(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setProfileVisible(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <ProfileOption
              icon="person"
              label="My account"
              onPress={() => openScreen('MyAccount')}
            />

            <ProfileOption
              icon="card-outline"
              label="My plan"
              onPress={() => openScreen('MyPlan')}
            />

            <ProfileOption
              icon="settings-outline"
              label="Settings"
              onPress={() => openScreen('Settings')}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const ProfileOption = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.profileCard} onPress={onPress}>
    <Ionicons name={icon} size={30} color={colors.primary} />
    <Text style={styles.profileCardText}>{label}</Text>
  </TouchableOpacity>
);

const BottomTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerTitleStyle: {
          color: colors.textDark,
          fontWeight: '700',
          fontSize: 20,
        },
        headerRight: () => <HeaderRightIcons />,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inactive,
        tabBarStyle: {
          height: 66,
          paddingTop: 8,
          paddingBottom: 8,
          backgroundColor: colors.white,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIcon: ({ color, focused }) => {
          let iconName = 'ellipse-outline';

          if (route.name === 'Summary') {
            iconName = focused ? 'refresh-circle' : 'refresh-circle-outline';
          } else if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'FAQ') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          }

          return <Ionicons name={iconName} size={20} color={color} />;
        },
      })}
    > 
      <Tab.Screen name="Summary" component={SummaryScreen} options={{ title: 'Summary' }} />
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="FAQ" component={FAQScreen} options={{ title: 'FAQ' }} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  headerIcons: {
    flexDirection: 'row',
    marginRight: 14,
    alignItems: 'center',
  },
  headerIconButton: {
    marginRight: 14,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.28)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 14,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
  },
  profileCardText: {
    marginLeft: 12,
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default BottomTabs;
