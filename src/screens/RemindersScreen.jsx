import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert as RNAlert,
} from 'react-native';
import {
  Container,
  Card,
  Badge,
  FloatingActionButton,
  Spinner,
  EmptyState,
  TabBar,
} from '../components';
import ReminderService from '../services/reminderService';

const RemindersScreen = ({navigation}) => {
  const [reminders, setReminders] = useState([]);
  const [filteredReminders, setFilteredReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterIndex, setFilterIndex] = useState(0);

  const filters = ['All', 'Pending', 'Completed'];

  useEffect(() => {
    loadReminders();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [filterIndex, reminders]);

  const loadReminders = async () => {
    try {
      const data = await ReminderService.getAllReminders();
      setReminders(data || []);
    } catch (error) {
      console.error('Error loading reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    let filtered = [...reminders];
    if (filterIndex === 1) {
      filtered = reminders.filter((r) => !(r.isCompleted || r.IsCompleted));
    } else if (filterIndex === 2) {
      filtered = reminders.filter((r) => (r.isCompleted || r.IsCompleted));
    }
    setFilteredReminders(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReminders();
    setRefreshing(false);
  };

  const handleDelete = (reminder) => {
    RNAlert.alert(
      'Delete Reminder',
      `Are you sure you want to delete "${reminder.title || reminder.Title}"?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await ReminderService.deleteReminder(reminder.id || reminder.Id);
              await loadReminders();
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
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderReminder = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ReminderDetails', {reminderId: item.id || item.Id})}
      onLongPress={() => handleDelete(item)}>
      <Card padding="md" style={{marginBottom: 12}}>
        <View className="flex-row justify-between items-start">
          <View className="flex-1 mr-3">
            <Text className="text-lg font-bold text-gray-900">{item.title || item.Title}</Text>
            {(item.description || item.Description) && (
              <Text className="text-gray-600 text-sm mt-1" numberOfLines={2}>
                {item.description || item.Description}
              </Text>
            )}
            <Text className="text-blue-600 text-sm mt-2">
              🕐 {formatDateTime(item.reminderTime || item.ReminderTime)}
            </Text>
          </View>
          <Badge variant={(item.isCompleted || item.IsCompleted) ? 'success' : 'warning'}>
            {(item.isCompleted || item.IsCompleted) ? '✓ Done' : 'Pending'}
          </Badge>
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <Container safe>
        <View className="flex-1 justify-center items-center">
          <Spinner text="Loading reminders..." />
        </View>
      </Container>
    );
  }

  return (
    <Container safe>
      {/* Header */}
      <View className="p-4 bg-blue-600">
        <Text className="text-white text-2xl font-bold">My Reminders</Text>
        <Text className="text-blue-100 mt-1">{reminders.length} total reminders</Text>
      </View>

      {/* Filter Tabs */}
      <TabBar
        tabs={filters.map((label) => ({label}))}
        activeIndex={filterIndex}
        onChange={setFilterIndex}
        variant="pills"
        style={{paddingHorizontal: 16, paddingVertical: 12}}
      />

      {/* Reminders List */}
      <View className="flex-1 px-4">
        {filteredReminders.length === 0 ? (
          <EmptyState
            icon={<Text style={{fontSize: 48}}>📝</Text>}
            title="No reminders found"
            description={
              filterIndex === 0
                ? 'Start by adding your first reminder'
                : filterIndex === 1
                ? 'No pending reminders'
                : 'No completed reminders yet'
            }
            actionLabel="Add Reminder"
            onActionPress={() => navigation.navigate('AddReminder')}
          />
        ) : (
          <FlatList
            data={filteredReminders}
            renderItem={renderReminder}
            keyExtractor={(item, index) => (item.id || item.Id) ? (item.id || item.Id).toString() : `reminder-${index}`}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{paddingVertical: 12}}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* FAB */}
      <FloatingActionButton
        icon={<Text style={{fontSize: 24, color: '#fff'}}>+</Text>}
        onPress={() => navigation.navigate('AddReminder')}
        position="bottom-right"
      />
    </Container>
  );
};

export default RemindersScreen;
