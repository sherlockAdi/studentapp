import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, Alert as RNAlert} from 'react-native';
import {Container, Card, Button, Avatar, Divider, Badge} from '../components';
import {getUserData, logoutUser} from '../utils/auth';

const ProfileScreen = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await getUserData();
      setUser(userData);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = () => {
    RNAlert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await logoutUser();
              navigation.replace('Login');
            } catch (error) {
              console.error('Logout error:', error);
              RNAlert.alert('Error', 'Failed to logout');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <Container safe>
      <ScrollView contentContainerStyle={{padding: 16}}>
        {/* Header */}
        <View className="items-center mb-6">
          <Avatar
            name={user?.fullName || 'User'}
            size="lg"
            backgroundColor="#3B82F6"
          />
          <Text className="text-2xl font-bold text-gray-900 mt-4">
            {user?.fullName || 'User'}
          </Text>
          <Text className="text-gray-600 mt-1">{user?.email}</Text>
          <Badge variant="success" style={{marginTop: 8}}>
            Active Account
          </Badge>
        </View>

        {/* Account Info Card */}
        <Card padding="lg" style={{marginBottom: 16}}>
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Account Information
          </Text>

          <View className="mb-3">
            <Text className="text-sm font-semibold text-gray-700 mb-1">
              Full Name
            </Text>
            <Text className="text-gray-900">{user?.fullName || 'N/A'}</Text>
          </View>

          <Divider marginVertical={2} />

          <View className="mb-3">
            <Text className="text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </Text>
            <Text className="text-gray-900">{user?.email || 'N/A'}</Text>
          </View>

          <Divider marginVertical={2} />

          <View className="mb-3">
            <Text className="text-sm font-semibold text-gray-700 mb-1">
              Phone Number
            </Text>
            <Text className="text-gray-900">{user?.phone || 'N/A'}</Text>
          </View>

          <Divider marginVertical={2} />

          <View>
            <Text className="text-sm font-semibold text-gray-700 mb-1">
              User ID
            </Text>
            <Text className="text-gray-900">{user?.id || 'N/A'}</Text>
          </View>
        </Card>

        {/* Settings Card */}
        <Card padding="lg" style={{marginBottom: 16}}>
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Settings
          </Text>

          <Button
            title="Edit Profile"
            variant="outline"
            fullWidth
            onPress={() => RNAlert.alert('Coming Soon', 'Edit profile feature coming soon!')}
            icon={<Text style={{fontSize: 20}}>✏️</Text>}
            iconPosition="left"
            style={{marginBottom: 12}}
          />

          <Button
            title="Change Password"
            variant="outline"
            fullWidth
            onPress={() => RNAlert.alert('Coming Soon', 'Change password feature coming soon!')}
            icon={<Text style={{fontSize: 20}}>🔒</Text>}
            iconPosition="left"
            style={{marginBottom: 12}}
          />

          <Button
            title="Notification Settings"
            variant="outline"
            fullWidth
            onPress={() => RNAlert.alert('Coming Soon', 'Notification settings coming soon!')}
            icon={<Text style={{fontSize: 20}}>🔔</Text>}
            iconPosition="left"
          />
        </Card>

        {/* App Info Card */}
        <Card padding="lg" style={{marginBottom: 16}}>
          <Text className="text-lg font-bold text-gray-900 mb-4">
            About App
          </Text>

          <View className="mb-3">
            <Text className="text-sm font-semibold text-gray-700 mb-1">
              App Name
            </Text>
            <Text className="text-gray-900">Healthcare Reminder</Text>
          </View>

          <Divider marginVertical={2} />

          <View className="mb-3">
            <Text className="text-sm font-semibold text-gray-700 mb-1">
              Version
            </Text>
            <Text className="text-gray-900">1.0.0</Text>
          </View>

          <Divider marginVertical={2} />

          <View>
            <Text className="text-sm font-semibold text-gray-700 mb-1">
              Developer
            </Text>
            <Text className="text-gray-900">Healthcare Team</Text>
          </View>
        </Card>

        {/* Logout Button */}
        <Button
          title={loading ? 'Logging out...' : 'Logout'}
          variant="danger"
          size="lg"
          fullWidth
          onPress={handleLogout}
          disabled={loading}
          loading={loading}
          icon={<Text style={{fontSize: 20, color: '#fff'}}>🚪</Text>}
          iconPosition="left"
        />

        {/* Footer */}
        <View className="items-center mt-6 mb-4">
          <Text className="text-gray-500 text-xs">
            © 2025 Healthcare Reminder App
          </Text>
          <Text className="text-gray-500 text-xs mt-1">
            All rights reserved
          </Text>
        </View>
      </ScrollView>
    </Container>
  );
};

export default ProfileScreen;
