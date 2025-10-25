import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from '../services/api';
import {API_ENDPOINTS} from '../config/api';

/**
 * Register new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Response object
 */
export const registerUser = async (userData) => {
  try {
    const response = await ApiService.post(
      API_ENDPOINTS.AUTH.REGISTER,
      userData,
      {requiresAuth: false}
    );
    return response;
  } catch (error) {
    console.error('Registration Error:', error);
    throw error;
  }
};

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} deviceInfo - Device information
 * @returns {Promise<Object>} Response object with tokens and user data
 */
export const loginUser = async (email, password, deviceInfo = 'React Native App') => {
  try {
    const response = await ApiService.post(
      API_ENDPOINTS.AUTH.LOGIN,
      {
        email,
        password,
        deviceInfo,
      },
      {requiresAuth: false}
    );
    console.log('Login response:', response);
    return response;
  } catch (error) {
    console.error('Login API Error:', error);
    throw new Error(error.message || 'Failed to login. Please try again.');
  }
};

/**
 * Save user data and tokens to AsyncStorage
 * @param {Object} loginResponse - Login response with tokens and user data
 */
export const saveUserData = async (loginResponse) => {
  try {
    const {accessToken, refreshToken, user} = loginResponse;
    
    await AsyncStorage.multiSet([
      ['accessToken', accessToken],
      ['refreshToken', refreshToken],
      ['userData', JSON.stringify(user)],
      ['isLoggedIn', 'true'],
      ['userId', user.id.toString()],
      ['userEmail', user.email],
    ]);
    
    console.log('User data and tokens saved successfully');
  } catch (error) {
    console.error('Error saving user data:', error);
    throw new Error('Failed to save user data');
  }
};

/**
 * Get user data from AsyncStorage
 * @returns {Promise<Object|null>} User data or null
 */
export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Check if user is logged in
 * @returns {Promise<boolean>} True if logged in
 */
export const isUserLoggedIn = async () => {
  try {
    const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
    return isLoggedIn === 'true';
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
};

/**
 * Logout user and clear data
 */
export const logoutUser = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    
    // Call logout API
    if (refreshToken) {
      try {
        await ApiService.post(API_ENDPOINTS.AUTH.LOGOUT, {refreshToken});
      } catch (error) {
        console.error('Logout API error:', error);
      }
    }
    
    // Clear all stored data
    await AsyncStorage.multiRemove([
      'accessToken',
      'refreshToken',
      'userData',
      'isLoggedIn',
      'userId',
      'userEmail',
    ]);
    
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Error logging out:', error);
    throw new Error('Failed to logout');
  }
};

/**
 * Get specific user field
 * @param {string} key - Key to retrieve
 * @returns {Promise<string|null>} Value or null
 */
export const getUserField = async (key) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error(`Error getting ${key}:`, error);
    return null;
  }
};

/**
 * Update user data
 * @param {Object} updates - Fields to update
 */
export const updateUserData = async (updates) => {
  try {
    const currentData = await getUserData();
    if (currentData) {
      const updatedData = {...currentData, ...updates};
      await AsyncStorage.setItem('userData', JSON.stringify(updatedData));
      console.log('User data updated successfully');
    }
  } catch (error) {
    console.error('Error updating user data:', error);
    throw new Error('Failed to update user data');
  }
};
