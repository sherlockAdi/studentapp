import React, {useState} from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {Alert} from '../components';
import {loginUser, saveUserData} from '../utils/auth';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateInputs = () => {
    if (!email.trim()) {
      setError('Please enter your email');
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!password.trim()) {
      setError('Please enter your password');
      return false;
    }
    if (password.length < 5) {
      setError('Password must be at least 5 characters');
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
      const response = await loginUser(email, password);
      console.log('Login response:', response);

      // Check if login was successful (response has accessToken)
      if (response.accessToken && response.user) {
        // Save tokens and user data to AsyncStorage
        await saveUserData(response);

        // Navigate to home screen
        console.log('Login successful:', response.user);
        setError('');
        
        // Navigate to Home screen
        if (navigation) {
          navigation.replace('Home');
        } else {
          alert('Login Successful!\nWelcome back!');
        }
      } else {
        setError('Login failed. Please check your credentials.');
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
      className="flex-1"
      style={{backgroundColor: '#FFFFFF'}}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, padding: 24}}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-center" style={{paddingHorizontal: 8}}>
          {/* LOGIN Header */}
          <Text
            className="text-center font-semibold mb-16"
            style={{color: '#000000', fontSize: 16, letterSpacing: 3}}>
            LOGIN
          </Text>

          {/* Healthcare Title */}
          <Text
            className="text-center font-bold mb-20"
            style={{color: '#000000', fontSize: 48}}>
            Healthcare
          </Text>

          {/* Error Alert */}
          {error ? (
            <View className="mb-4">
              <Alert type="error" message={error} />
            </View>
          ) : null}

          {/* Email Input */}
          <View className="mb-8">
            <Text className="text-sm font-medium mb-2" style={{color: '#000000'}}>
              Email Id
            </Text>
            <View
              className="flex-row items-center"
              style={{
                borderWidth: 1,
                borderColor: '#CCCCCC',
                borderRadius: 25,
                paddingHorizontal: 20,
                paddingVertical: 16,
                backgroundColor: '#FFFFFF',
              }}>
              <View style={{marginRight: 16}}>
                <Text style={{fontSize: 22}}>✉</Text>
              </View>
              <TextInput
                className="flex-1"
                placeholder=""
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
                style={{color: '#000000', fontSize: 16}}
                placeholderTextColor="#999999"
              />
            </View>
          </View>

          {/* Password Input */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2" style={{color: '#000000'}}>
              Password
            </Text>
            <View
              className="flex-row items-center"
              style={{
                borderWidth: 1,
                borderColor: '#CCCCCC',
                borderRadius: 25,
                paddingHorizontal: 20,
                paddingVertical: 16,
                backgroundColor: '#FFFFFF',
              }}>
              <View style={{marginRight: 16}}>
                <Text style={{fontSize: 22}}>🔒</Text>
              </View>
              <TextInput
                className="flex-1"
                placeholder=""
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError('');
                }}
                secureTextEntry={!showPassword}
                editable={!loading}
                style={{color: '#000000', fontSize: 16}}
                placeholderTextColor="#999999"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={{fontSize: 20}}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <View className="items-end mb-10">
            <TouchableOpacity disabled={loading}>
              <Text className="text-sm font-semibold" style={{color: '#2E5C8A'}}>
                Forgot Password !
              </Text>
            </TouchableOpacity>
          </View>

          {/* Register Link */}
          <View className="flex-row justify-center items-center mb-16">
            <Text className="text-sm" style={{color: '#000000'}}>
              Don't Have an Account : {' '}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              disabled={loading}>
              <Text className="text-sm font-semibold" style={{color: '#2E5C8A'}}>
                Click here to register
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            className="items-center"
            style={{
              backgroundColor: '#5B9BD5',
              borderRadius: 12,
              paddingVertical: 18,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}>
            <Text className="text-white font-bold" style={{fontSize: 18, letterSpacing: 2}}>
              {loading ? 'LOGGING IN...' : 'LOGIN'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
