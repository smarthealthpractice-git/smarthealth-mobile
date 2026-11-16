import React, {useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

import AppointmentScreen from '../screens/appointment/AppointmentScreen';
import ConfirmAppointmentScreen from '../screens/appointment/ConfirmAppointmentScreen';

import MyAccountScreen from '../screens/profile/MyAccountScreen';
import MyPlanScreen from '../screens/profile/MyPlanScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';

import DoctorAccessScreen from '../screens/access/DoctorAccessScreen';

import BottomTabs from './BottomTabs';

//mapping of available screens 
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [authenticated, setAuthenticated] = useState(false);
  

  return (
    <NavigationContainer>
      <Stack.Navigator 
      initialRouteName={authenticated ? 'MainTabs' : 'Onboarding'}> 
      {!authenticated ? ( 
        <>
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />


<Stack.Screen
  name="Login"
  options={{ headerShown: false }}
>
  {props => (
    <LoginScreen
      {...props}
      onLoginSuccess={() => setAuthenticated(true)}
    />
  )}
</Stack.Screen>

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        </> 
      ) : ( 
      <>
        <Stack.Screen
          name="Appointment"
          component={AppointmentScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ConfirmAppointment"
          component={ConfirmAppointmentScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="MyAccount"
          component={MyAccountScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="MyPlan"
          component={MyPlanScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerShown: false }}
        />

	<Stack.Screen
          name="DoctorAccess"
          component={DoctorAccessScreen}
          options={{ headerShown: false }}
        />
	

        <Stack.Screen
          name="MainTabs"
          component={BottomTabs} 
          options={{ headerShown: false }}
        />
        </>
      )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;