import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// Auth Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Main Screens
import DashboardScreen from '../screens/DashboardScreen';
import RemindersScreen from '../screens/RemindersScreen';
import AddReminderScreen from '../screens/AddReminderScreen';
import ReminderDetailsScreen from '../screens/ReminderDetailsScreen';
import PharmaciesScreen from '../screens/PharmaciesScreen';
import PharmacyNearbyScreen from '../screens/PharmacyNearbyScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator for Main App
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Text style={{fontSize: size, color}}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Reminders"
        component={RemindersScreen}
        options={{
          tabBarLabel: 'Reminders',
          tabBarIcon: ({color, size}) => (
            <Text style={{fontSize: size, color}}>📝</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Pharmacies"
        component={PharmacyNearbyScreen}
        options={{
          tabBarLabel: 'Pharmacies',
          tabBarIcon: ({color, size}) => (
            <Text style={{fontSize: size, color}}>💊</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <Text style={{fontSize: size, color}}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigations = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}>
        {/* Auth Stack */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        
        {/* Main App with Bottom Tabs */}
        <Stack.Screen name="Home" component={MainTabs} />
        
        {/* Modal Screens */}
        <Stack.Screen 
          name="AddReminder" 
          component={AddReminderScreen}
          options={{
            presentation: 'modal',
            headerShown: true,
            headerTitle: 'Add Reminder',
          }}
        />
        <Stack.Screen 
          name="ReminderDetails" 
          component={ReminderDetailsScreen}
          options={{
            headerShown: true,
            headerTitle: 'Reminder Details',
          }}
        />
        <Stack.Screen 
          name="PharmacyNearby" 
          component={PharmacyNearbyScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigations;

const styles = StyleSheet.create({});
