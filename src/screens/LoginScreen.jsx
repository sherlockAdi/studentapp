import React, {useState} from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {
  Input,
  Button,
  Alert,
} from '../components';
import {loginUser, saveUserData} from '../utils/auth';

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateInputs = () => {
    if (!username.trim()) {
      setError('Please enter your username or email');
      return false;
    }
    if (!password.trim()) {
      setError('Please enter your password');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    setError('');

    if (!validateInputs()) {
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser(username, password);
      console.log('Login response:', response);

      if (response.Success) {
        // Save user data to AsyncStorage
        await saveUserData({
          userId: response.userid,
          userEmail: response.useremail,
          roleId: response.RoleId,
          username: username,
        });

        // Navigate to home screen
        console.log('Login successful:', response);
        setError('');
        
        // Navigate to Home screen
        if (navigation) {
          navigation.replace('Home');
        } else {
          alert('Login Successful!\nWelcome back!');
        }
      } else {
        setError(response.Message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 justify-center px-6"
      style={{backgroundColor: '#3B82F6'}}>
      <View className="w-full max-w-md mx-auto">
        {/* Logo */}
        <View className="items-center mb-8">
          <View
            className="w-20 h-20 rounded-full bg-white items-center justify-center mb-4"
            style={{elevation: 8}}>
            <Text style={{fontSize: 40}}>🎓</Text>
          </View>
          <Text className="text-white text-3xl font-bold">Student Login</Text>
        </View>

        {/* Login Form */}
        <View
          className="bg-white rounded-2xl p-6"
          style={{elevation: 12}}>
          
          {/* Error Alert */}
          {error ? (
            <Alert type="error" message={error} style={{marginBottom: 16}} />
          ) : null}

          {/* Username Input */}
          <Input
            label="Username"
            placeholder="Enter username"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setError('');
            }}
            leftIcon={<Text style={{fontSize: 20}}>👤</Text>}
            autoCapitalize="none"
            editable={!loading}
          />

          {/* Password Input */}
          <Input
            label="Password"
            placeholder="Enter password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError('');
            }}
            secureTextEntry={!showPassword}
            leftIcon={<Text style={{fontSize: 20}}>🔒</Text>}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={{fontSize: 20}}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            }
            editable={!loading}
          />

          {/* Login Button */}
          <Button
            title={loading ? 'Logging in...' : 'Login'}
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleLogin}
            disabled={loading}
            loading={loading}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
