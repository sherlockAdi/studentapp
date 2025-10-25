import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {Container, Input, Button, Alert, Card} from '../components';
import ReminderService from '../services/reminderService';

const AddReminderScreen = ({navigation, route}) => {
  const {reminderId} = route.params || {};
  const isEdit = !!reminderId;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      loadReminder();
    }
  }, [reminderId]);

  const loadReminder = async () => {
    try {
      const data = await ReminderService.getReminderById(reminderId);
      setTitle(data.title);
      setDescription(data.description || '');
      
      // Parse date and time
      const date = new Date(data.reminderTime);
      setReminderDate(date.toISOString().split('T')[0]);
      setReminderTime(date.toTimeString().slice(0, 5));
    } catch (error) {
      console.error('Error loading reminder:', error);
      setError('Failed to load reminder');
    }
  };

  const validateInputs = () => {
    if (!title.trim()) {
      setError('Please enter a title');
      return false;
    }
    if (!reminderDate) {
      setError('Please select a date');
      return false;
    }
    if (!reminderTime) {
      setError('Please select a time');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    setError('');

    if (!validateInputs()) {
      return;
    }

    setLoading(true);

    try {
      // Combine date and time
      const reminderDateTime = new Date(`${reminderDate}T${reminderTime}`).toISOString();

      const reminderData = {
        title: title.trim(),
        description: description.trim(),
        reminderTime: reminderDateTime,
      };

      if (isEdit) {
        await ReminderService.updateReminder(reminderId, reminderData);
      } else {
        await ReminderService.createReminder(reminderData);
      }

      navigation.goBack();
    } catch (err) {
      console.error('Error saving reminder:', err);
      setError(err.message || 'Failed to save reminder');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container safe>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView
          contentContainerStyle={{padding: 16}}
          keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit Reminder' : 'Add New Reminder'}
            </Text>
            <Text className="text-gray-600 mt-1">
              {isEdit ? 'Update your reminder details' : 'Create a new health reminder'}
            </Text>
          </View>

          <Card padding="lg">
            {/* Error Alert */}
            {error ? (
              <Alert type="error" message={error} style={{marginBottom: 16}} />
            ) : null}

            {/* Title Input */}
            <Input
              label="Title *"
              placeholder="e.g., Take Blood Pressure Medicine"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                setError('');
              }}
              leftIcon={<Text style={{fontSize: 20}}>📝</Text>}
              editable={!loading}
            />

            {/* Description Input */}
            <Input
              label="Description"
              placeholder="Add notes or instructions (optional)"
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                setError('');
              }}
              leftIcon={<Text style={{fontSize: 20}}>📄</Text>}
              multiline
              numberOfLines={3}
              editable={!loading}
            />

            {/* Date Input */}
            <Input
              label="Date *"
              placeholder="YYYY-MM-DD"
              value={reminderDate}
              onChangeText={(text) => {
                setReminderDate(text);
                setError('');
              }}
              leftIcon={<Text style={{fontSize: 20}}>📅</Text>}
              editable={!loading}
            />

            {/* Time Input */}
            <Input
              label="Time *"
              placeholder="HH:MM (24-hour format)"
              value={reminderTime}
              onChangeText={(text) => {
                setReminderTime(text);
                setError('');
              }}
              leftIcon={<Text style={{fontSize: 20}}>🕐</Text>}
              editable={!loading}
            />

            {/* Helper Text */}
            <View className="bg-blue-50 p-3 rounded-lg mb-4">
              <Text className="text-blue-800 text-sm">
                💡 Tip: Use format 2024-10-26 for date and 14:30 for time
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={{gap: 12}}>
              <Button
                title={loading ? 'Saving...' : isEdit ? 'Update Reminder' : 'Create Reminder'}
                variant="primary"
                size="lg"
                fullWidth
                onPress={handleSave}
                disabled={loading}
                loading={loading}
              />
              <Button
                title="Cancel"
                variant="outline"
                size="lg"
                fullWidth
                onPress={() => navigation.goBack()}
                disabled={loading}
              />
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default AddReminderScreen;
