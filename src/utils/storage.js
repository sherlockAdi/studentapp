import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Generic storage utility functions
 */

/**
 * Save data to AsyncStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store (will be JSON stringified)
 */
export const saveData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error(`Error saving data for key ${key}:`, error);
    return false;
  }
};

/**
 * Get data from AsyncStorage
 * @param {string} key - Storage key
 * @returns {Promise<any>} Parsed value or null
 */
export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error getting data for key ${key}:`, error);
    return null;
  }
};

/**
 * Remove data from AsyncStorage
 * @param {string} key - Storage key
 */
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing data for key ${key}:`, error);
    return false;
  }
};

/**
 * Clear all data from AsyncStorage
 */
export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
};

/**
 * Get all keys from AsyncStorage
 * @returns {Promise<string[]>} Array of keys
 */
export const getAllKeys = async () => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error('Error getting all keys:', error);
    return [];
  }
};

/**
 * Save multiple items at once
 * @param {Array<[string, any]>} keyValuePairs - Array of [key, value] pairs
 */
export const saveMultiple = async (keyValuePairs) => {
  try {
    const pairs = keyValuePairs.map(([key, value]) => [
      key,
      JSON.stringify(value),
    ]);
    await AsyncStorage.multiSet(pairs);
    return true;
  } catch (error) {
    console.error('Error saving multiple items:', error);
    return false;
  }
};

/**
 * Get multiple items at once
 * @param {string[]} keys - Array of keys
 * @returns {Promise<Object>} Object with key-value pairs
 */
export const getMultiple = async (keys) => {
  try {
    const pairs = await AsyncStorage.multiGet(keys);
    const result = {};
    pairs.forEach(([key, value]) => {
      result[key] = value ? JSON.parse(value) : null;
    });
    return result;
  } catch (error) {
    console.error('Error getting multiple items:', error);
    return {};
  }
};
