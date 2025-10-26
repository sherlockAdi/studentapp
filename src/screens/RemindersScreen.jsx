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
    {/* Gradient Header */}
    <View
      style={{
        padding: 24,
        backgroundColor: '#4F46E5',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        elevation: 10,
      }}>
      <Text style={{color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 14}}>
        My Reminders
      </Text>
      {/* <Text style={{color: '#E0E7FF', marginTop: 4, fontSize: 14}}>
        Keep track of your important tasks ✨
      </Text> */}
    </View>

    {/* Stats Boxes */}
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: -35,
      }}>
      {[
        {
          title: 'Pending',
          count: reminders.filter(
            (r) => !(r.isCompleted || r.IsCompleted)
          ).length,
          color: '#FBBF24',
        },
        {
          title: 'Completed',
          count: reminders.filter(
            (r) => r.isCompleted || r.IsCompleted
          ).length,
          color: '#10B981',
        },
        {
          title: 'Total',
          count: reminders.length,
          color: '#6366F1',
        },
      ].map((box, i) => (
        <View
          key={i}
          style={{
            backgroundColor: '#fff',
            flex: 1,
            marginHorizontal: 4,
            borderRadius: 20,
            padding: 14,
            alignItems: 'center',
            elevation: 5,
            shadowColor: '#000',
          }}>
          <Text style={{fontSize: 12, color: '#6B7280'}}>{box.title}</Text>
          <Text
            style={{
              fontSize: 22,
              fontWeight: '700',
              marginTop: 6,
              color: box.color,
            }}>
            {box.count}
          </Text>
        </View>
      ))}
    </View>

    {/* Tabs */}
    <View style={{paddingHorizontal: 20, marginVertical: 12}}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#EEF2FF',
          borderRadius: 16,
          padding: 5,
        }}>
        {filters.map((label, index) => {
          const active = index === filterIndex;
          return (
            <TouchableOpacity
              key={label}
              onPress={() => setFilterIndex(index)}
              style={{
                flex: 1,
                paddingVertical: 8,
                borderRadius: 12,
                backgroundColor: active ? '#4338CA' : 'transparent',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: active ? '#fff' : '#4338CA',
                  fontWeight: '700',
                }}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>

    {/* Reminder List */}
    <View style={{flex: 1, paddingHorizontal: 20}}>
      {filteredReminders.length === 0 ? (
        <EmptyState
          icon={<Text style={{fontSize: 48}}>📌</Text>}
          title="No reminders here"
          description="Tap + button to add a reminder"
          actionLabel="Add Reminder"
          onActionPress={() => navigation.navigate('AddReminder')}
        />
      ) : (
        <FlatList
          data={filteredReminders}
          keyExtractor={(item, i) =>
            (item.id || item.Id)?.toString() || `rem-${i}`
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingVertical: 10}}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ReminderDetails', {
                  reminderId: item.id || item.Id,
                })
              }
              onLongPress={() => handleDelete(item)}>
              <View
                style={{
                  backgroundColor: '#fff',
                  padding: 16,
                  marginBottom: 14,
                  borderRadius: 20,
                  elevation: 4,
                  shadowColor: '#000',
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: '#111827',
                  }}>
                  {item.isCompleted || item.IsCompleted ? '✅' : '⏰'}{' '}
                  {item.title || item.Title}
                </Text>
                {(item.description || item.Description) && (
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#6B7280',
                      marginTop: 4,
                    }}
                    numberOfLines={2}>
                    {item.description || item.Description}
                  </Text>
                )}
                <Text style={{marginTop: 8, color: '#6366F1'}}>
                  🕐 {formatDateTime(item.reminderTime || item.ReminderTime)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>

    {/* Add Button */}
    <FloatingActionButton
      icon={<Text style={{fontSize: 28, color: '#fff'}}>+</Text>}
      onPress={() => navigation.navigate('AddReminder')}
      position="bottom-right"
      style={{
        backgroundColor: '#4F46E5',
        borderRadius: 50,
        elevation: 10,
      }}
    />
  </Container>
);

};

export default RemindersScreen;
