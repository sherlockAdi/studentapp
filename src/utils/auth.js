import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://61.246.33.108:8069/studentapi';

/**
 * Login user with username and password
 * @param {string} username - Username or email
 * @param {string} password - User password
 * @returns {Promise<Object>} Response object with user data
 */
export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        Username: username,
        Password: password,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Login API Error:', error);
    throw new Error(error.message || 'Failed to login. Please try again.');
  }
};

/**
 * Save user data to AsyncStorage
 * @param {Object} userData - User data to save
 */
export const saveUserData = async (userData) => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    await AsyncStorage.setItem('isLoggedIn', 'true');
    await AsyncStorage.setItem('userId', userData.userId);
    await AsyncStorage.setItem('userEmail', userData.userEmail);
    await AsyncStorage.setItem('roleId', userData.RoleId);
    console.log('User data saved successfully');
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
    await AsyncStorage.multiRemove([
      'userData',
      'isLoggedIn',
      'userId',
      'userEmail',
      'roleId',
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
