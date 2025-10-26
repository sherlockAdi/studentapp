import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, TouchableOpacity, RefreshControl, Image} from 'react-native';
import {Spinner} from '../components';
import {getUserData} from '../utils/auth';
import ReminderService from '../services/reminderService';

const DashboardScreen = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await getUserData();
      setUser(userData);
      await loadReminders();
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReminders = async () => {
    try {
      const data = await ReminderService.getAllReminders();
      setReminders(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  };

  const calculateStats = (remindersList) => {
    const today = new Date().toDateString();
    const completed = remindersList.filter((r) => (r.isCompleted || r.IsCompleted)).length;
    const pending = remindersList.filter((r) => !(r.isCompleted || r.IsCompleted)).length;
    const todayCount = remindersList.filter((r) => {
      const reminderDate = new Date(r.reminderTime || r.ReminderTime).toDateString();
      return reminderDate === today;
    }).length;

    setStats({
      total: remindersList.length,
      completed,
      pending,
      today: todayCount,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReminders();
    setRefreshing(false);
  };

  const getUpcomingReminders = () => {
    const now = new Date();
    return reminders
      .filter((r) => !(r.isCompleted || r.IsCompleted) && new Date(r.reminderTime || r.ReminderTime) > now)
      .sort((a, b) => new Date(a.reminderTime || a.ReminderTime) - new Date(b.reminderTime || b.ReminderTime))
      .slice(0, 3);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Spinner text="Loading..." />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 70}}>
        
        {/* Header */}
        <View className="flex-row justify-between items-center px-4 pt-8 pb-3">
          <TouchableOpacity>
            <Text style={{fontSize: 24}}>☰</Text>
          </TouchableOpacity>
          
          <Text style={{fontSize: 18, fontWeight: 'bold', color: '#4A90E2'}}>Healthy</Text>
          
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: '#333',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 18}}>🎤</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons Grid */}
        <View className="px-4 mb-3">
          <View className="flex-row mb-3" style={{gap: 10}}>
            <TouchableOpacity
              className="flex-1 bg-white rounded-xl p-3 flex-row items-center justify-between"
              style={{borderWidth: 1, borderColor: '#E0E0E0'}}
              onPress={() => navigation.navigate('PharmacyNearby')}>
              <Text className="text-sm font-medium" style={{color: '#333'}}>Questions</Text>
              <Text style={{fontSize: 20}}>❓</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="flex-1 bg-white rounded-xl p-3 flex-row items-center justify-between"
              style={{borderWidth: 1, borderColor: '#E0E0E0'}}
              onPress={() => navigation.navigate('Reminders')}>
              <Text className="text-sm font-medium" style={{color: '#333'}}>Reminders</Text>
              <Text style={{fontSize: 20}}>📋</Text>
            </TouchableOpacity>
          </View>
          
          <View className="flex-row" style={{gap: 10}}>
            <TouchableOpacity
              className="flex-1 bg-white rounded-xl p-3 flex-row items-center justify-between"
              style={{borderWidth: 1, borderColor: '#E0E0E0'}}
              onPress={() => {}}>
              <Text className="text-sm font-medium" style={{color: '#333'}}>Messages</Text>
              <Text style={{fontSize: 20}}>💬</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="flex-1 bg-white rounded-xl p-3 flex-row items-center justify-between"
              style={{borderWidth: 1, borderColor: '#E0E0E0'}}
              onPress={() => {}}>
              <Text className="text-sm font-medium" style={{color: '#333'}}>Calendar</Text>
              <Text style={{fontSize: 20}}>📅</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upload Prescription Card */}
        <View className="px-4 mb-3">
          <View className="bg-white rounded-xl p-3" style={{borderWidth: 1, borderColor: '#E0E0E0'}}>
            <Text className="text-base font-bold mb-1" style={{color: '#333'}}>
              UPLOAD PRESCRIPTION
            </Text>
            <Text className="text-xs mb-2" style={{color: '#666'}}>
              Upload a Prescription and Tell Us What you Need. We do the Rest.!
            </Text>
            
            <View className="flex-row items-center justify-between">
              <Text className="text-xs font-semibold" style={{color: '#333'}}>
                Flat 25% OFF ON{'\n'}MEDICINES
              </Text>
              <TouchableOpacity
                className="rounded-lg px-4 py-2"
                style={{backgroundColor: '#2196F3'}}>
                <Text className="text-white text-xs font-bold">ORDER NOW</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Medical Service Card */}
        <View className="px-4 mb-3">
          <View
            className="rounded-xl p-3"
            style={{backgroundColor: '#C8E6C9'}}>
            <View className="flex-row justify-between">
              <View className="flex-1">
                <Text className="text-base font-bold mb-1" style={{color: '#2E7D32'}}>
                  Get the Best{'\n'}Medical Service
                </Text>
                <Text className="text-xs" style={{color: '#1B5E20', lineHeight: 14}} numberOfLines={3}>
                  Rem illum facere quo corporis Quis in saepe itaque ut quos pariatur. Qui numquam rerum hic repudiandae rerum id amet tempora nam molestias omnis qui earum voluptatem!
                </Text>
              </View>
              <View className="ml-2">
                <Text style={{fontSize: 50}}>👨‍⚕️</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Discount Card */}
        <View className="px-4 mb-3">
          <View
            className="rounded-xl p-3"
            style={{backgroundColor: '#E1BEE7'}}>
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-2xl font-bold" style={{color: '#4A148C'}}>
                  UPTO 80%
                </Text>
                <Text className="text-lg font-bold mb-1" style={{color: '#4A148C'}}>
                  offer
                </Text>
                <Text className="text-xs font-semibold mb-2" style={{color: '#6A1B9A'}}>
                  On Health Products
                </Text>
                <TouchableOpacity
                  className="rounded-lg px-4 py-2 self-start"
                  style={{backgroundColor: '#2196F3'}}>
                  <Text className="text-white text-xs font-bold">SHOP NOW</Text>
                </TouchableOpacity>
              </View>
              <View className="ml-2">
                <Text style={{fontSize: 60}}>💊</Text>
              </View>
            </View>
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

export default DashboardScreen;
