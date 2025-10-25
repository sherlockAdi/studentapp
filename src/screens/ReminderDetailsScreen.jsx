import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, Alert as RNAlert} from 'react-native';
import {Container, Card, Button, Badge, Spinner, Divider} from '../components';
import ReminderService from '../services/reminderService';

const ReminderDetailsScreen = ({navigation, route}) => {
  const {reminderId} = route.params;
  const [reminder, setReminder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadReminder();
  }, [reminderId]);

  const loadReminder = async () => {
    try {
      const data = await ReminderService.getReminderById(reminderId);
      setReminder(data);
    } catch (error) {
      console.error('Error loading reminder:', error);
      RNAlert.alert('Error', 'Failed to load reminder details');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setActionLoading(true);
    try {
      await ReminderService.completeReminder(reminderId);
      await loadReminder();
      RNAlert.alert('Success', 'Reminder marked as completed!');
    } catch (error) {
      console.error('Error completing reminder:', error);
      RNAlert.alert('Error', 'Failed to mark reminder as completed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = () => {
    RNAlert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await ReminderService.deleteReminder(reminderId);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting reminder:', error);
              RNAlert.alert('Error', 'Failed to delete reminder');
            }
          },
        },
      ]
    );
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Container safe>
        <View className="flex-1 justify-center items-center">
          <Spinner text="Loading reminder..." />
        </View>
      </Container>
    );
  }

  if (!reminder) {
    return (
      <Container safe>
        <View className="flex-1 justify-center items-center p-6">
          <Text className="text-xl text-gray-600">Reminder not found</Text>
          <Button
            title="Go Back"
            variant="primary"
            onPress={() => navigation.goBack()}
            style={{marginTop: 16}}
          />
        </View>
      </Container>
    );
  }

  return (
    <Container safe>
      <ScrollView contentContainerStyle={{padding: 16}}>
        {/* Status Badge */}
        <View className="items-center mb-6">
          <Badge
            variant={reminder.isCompleted ? 'success' : 'warning'}
            style={{paddingHorizontal: 20, paddingVertical: 8}}>
            <Text className="text-base font-bold">
              {reminder.isCompleted ? '✓ Completed' : '⏰ Pending'}
            </Text>
          </Badge>
        </View>

        {/* Main Card */}
        <Card padding="lg" style={{marginBottom: 16}}>
          {/* Title */}
          <Text className="text-2xl font-bold text-gray-900 mb-4">
            {reminder.title}
          </Text>

          <Divider marginVertical={2} />

          {/* Description */}
          {reminder.description && (
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Description:
              </Text>
              <Text className="text-gray-600">{reminder.description}</Text>
            </View>
          )}

          {/* Reminder Time */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Reminder Time:
            </Text>
            <View className="flex-row items-center">
              <Text style={{fontSize: 20, marginRight: 8}}>🕐</Text>
              <Text className="text-gray-900 text-base">
                {formatDateTime(reminder.reminderTime)}
              </Text>
            </View>
          </View>

          {/* Completed At */}
          {reminder.isCompleted && reminder.completedAt && (
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Completed At:
              </Text>
              <View className="flex-row items-center">
                <Text style={{fontSize: 20, marginRight: 8}}>✓</Text>
                <Text className="text-gray-900 text-base">
                  {formatDateTime(reminder.completedAt)}
                </Text>
              </View>
            </View>
          )}

          <Divider marginVertical={2} />

          {/* Metadata */}
          <View className="mt-4">
            <Text className="text-xs text-gray-500">
              Created: {new Date(reminder.createdAt).toLocaleDateString()}
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              Updated: {new Date(reminder.updatedAt).toLocaleDateString()}
            </Text>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={{gap: 12}}>
          {!reminder.isCompleted && (
            <Button
              title={actionLoading ? 'Marking Complete...' : 'Mark as Completed'}
              variant="success"
              size="lg"
              fullWidth
              onPress={handleComplete}
              disabled={actionLoading}
              loading={actionLoading}
              icon={<Text style={{fontSize: 20, color: '#fff'}}>✓</Text>}
              iconPosition="left"
            />
          )}

          <Button
            title="Edit Reminder"
            variant="primary"
            size="lg"
            fullWidth
            onPress={() =>
              navigation.navigate('AddReminder', {reminderId: reminder.id})
            }
            disabled={actionLoading}
            icon={<Text style={{fontSize: 20, color: '#fff'}}>✏️</Text>}
            iconPosition="left"
          />

          <Button
            title="Delete Reminder"
            variant="danger"
            size="lg"
            fullWidth
            onPress={handleDelete}
            disabled={actionLoading}
            icon={<Text style={{fontSize: 20, color: '#fff'}}>🗑️</Text>}
            iconPosition="left"
          />

          <Button
            title="Back to List"
            variant="outline"
            size="lg"
            fullWidth
            onPress={() => navigation.goBack()}
            disabled={actionLoading}
          />
        </View>
      </ScrollView>
    </Container>
  );
};

export default ReminderDetailsScreen;
