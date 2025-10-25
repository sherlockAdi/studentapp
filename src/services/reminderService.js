import ApiService from './api';
import {API_ENDPOINTS} from '../config/api';

/**
 * Reminder Service - Handles all reminder-related API calls
 */

class ReminderService {
  /**
   * Get all reminders for authenticated user
   */
  async getAllReminders() {
    try {
      return await ApiService.get(API_ENDPOINTS.REMINDERS.GET_ALL);
    } catch (error) {
      console.error('Get reminders error:', error);
      throw error;
    }
  }

  /**
   * Create a new reminder
   */
  async createReminder(reminderData) {
    try {
      return await ApiService.post(API_ENDPOINTS.REMINDERS.CREATE, reminderData);
    } catch (error) {
      console.error('Create reminder error:', error);
      throw error;
    }
  }

  /**
   * Get reminder by ID
   */
  async getReminderById(id) {
    try {
      return await ApiService.get(API_ENDPOINTS.REMINDERS.GET_BY_ID(id));
    } catch (error) {
      console.error('Get reminder by ID error:', error);
      throw error;
    }
  }

  /**
   * Update reminder
   */
  async updateReminder(id, reminderData) {
    try {
      return await ApiService.put(API_ENDPOINTS.REMINDERS.UPDATE(id), reminderData);
    } catch (error) {
      console.error('Update reminder error:', error);
      throw error;
    }
  }

  /**
   * Delete reminder
   */
  async deleteReminder(id) {
    try {
      return await ApiService.delete(API_ENDPOINTS.REMINDERS.DELETE(id));
    } catch (error) {
      console.error('Delete reminder error:', error);
      throw error;
    }
  }

  /**
   * Mark reminder as completed
   */
  async completeReminder(id) {
    try {
      return await ApiService.patch(API_ENDPOINTS.REMINDERS.COMPLETE(id));
    } catch (error) {
      console.error('Complete reminder error:', error);
      throw error;
    }
  }
}

export default new ReminderService();
