import ApiService from './api';
import {API_ENDPOINTS} from '../config/api';

/**
 * File Service - Handles all file-related API calls
 */

class FileService {
  /**
   * Get all files for authenticated user
   */
  async getAllFiles(reminderId = null) {
    try {
      let endpoint = API_ENDPOINTS.FILES.GET_ALL;
      if (reminderId) {
        endpoint += `?reminderId=${reminderId}`;
      }
      return await ApiService.get(endpoint);
    } catch (error) {
      console.error('Get files error:', error);
      throw error;
    }
  }

  /**
   * Upload a new file
   */
  async uploadFile(fileData) {
    try {
      return await ApiService.post(API_ENDPOINTS.FILES.UPLOAD, fileData);
    } catch (error) {
      console.error('Upload file error:', error);
      throw error;
    }
  }

  /**
   * Get file by ID
   */
  async getFileById(id) {
    try {
      return await ApiService.get(API_ENDPOINTS.FILES.GET_BY_ID(id));
    } catch (error) {
      console.error('Get file by ID error:', error);
      throw error;
    }
  }

  /**
   * Delete file
   */
  async deleteFile(id) {
    try {
      return await ApiService.delete(API_ENDPOINTS.FILES.DELETE(id));
    } catch (error) {
      console.error('Delete file error:', error);
      throw error;
    }
  }
}

export default new FileService();
