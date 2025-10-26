import ApiService from './api';
import {API_ENDPOINTS} from '../config/api';

/**
 * Pharmacy Service - Handles all pharmacy-related API calls
 */

class PharmacyService {
  /**
   * Get all pharmacies
   */
  async getAllPharmacies() {
    try {
      return await ApiService.get(API_ENDPOINTS.PHARMACY.GET_ALL);
    } catch (error) {
      console.error('Get pharmacies error:', error);
      throw error;
    }
  }

  /**
   * Get nearby pharmacies
   */
  async getNearbyPharmacies(latitude, longitude) {
    try {
      const endpoint = `${API_ENDPOINTS.PHARMACY.NEARBY}?lat=${latitude}&long=${longitude}`;
      return await ApiService.get(endpoint);
    } catch (error) {
      console.error('Get nearby pharmacies error:', error);
      throw error;
    }
  }

  /**
   * Create a new pharmacy
   */
  async createPharmacy(pharmacyData) {
    try {
      return await ApiService.post(API_ENDPOINTS.PHARMACY.CREATE, pharmacyData);
    } catch (error) {
      console.error('Create pharmacy error:', error);
      throw error;
    }
  }

  /**
   * Get pharmacy by ID
   */
  async getPharmacyById(id) {
    try {
      return await ApiService.get(API_ENDPOINTS.PHARMACY.GET_BY_ID(id));
    } catch (error) {
      console.error('Get pharmacy by ID error:', error);
      throw error;
    }
  }

  /**
   * Update pharmacy
   */
  async updatePharmacy(id, pharmacyData) {
    try {
      return await ApiService.put(API_ENDPOINTS.PHARMACY.UPDATE(id), pharmacyData);
    } catch (error) {
      console.error('Update pharmacy error:', error);
      throw error;
    }
  }

  /**
   * Delete pharmacy
   */
  async deletePharmacy(id) {
    try {
      return await ApiService.delete(API_ENDPOINTS.PHARMACY.DELETE(id));
    } catch (error) {
      console.error('Delete pharmacy error:', error);
      throw error;
    }
  }
}

export default new PharmacyService();
