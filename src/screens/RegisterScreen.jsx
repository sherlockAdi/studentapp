import React, {useState} from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Input, Button, Alert} from '../components';
import {registerUser} from '../utils/auth';

const RegisterScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateInputs = () => {
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!email.trim()) {
      setError('Please enter your email');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!phone.trim()) {
      setError('Please enter your phone number');
      return false;
    }
    if (phone.length < 10) {
      setError('Please enter a valid phone number');
      return false;
    }
    if (!password.trim()) {
      setError('Please enter a password');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    setError('');

    if (!validateInputs()) {
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser({
        email,
        password,
        fullName,
        phone,
      });

      console.log('Registration response:', response);

      if (response.success || response.userId) {
        alert('Registration Successful!\nPlease login with your credentials.');
        navigation.navigate('Login');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
      style={{backgroundColor: '#3B82F6'}}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, justifyContent: 'center', padding: 24}}
        keyboardShouldPersistTaps="handled">
        <View className="w-full max-w-md mx-auto">
          {/* Logo */}
          <View className="items-center mb-6">
            <View
              className="w-20 h-20 rounded-full bg-white items-center justify-center mb-3"
              style={{elevation: 8}}>
              <Text style={{fontSize: 40}}>🎓</Text>
            </View>
            <Text className="text-white text-3xl font-bold">Create Account</Text>
            <Text className="text-blue-100 text-sm mt-2">Sign up to get started</Text>
          </View>

          {/* Register Form */}
          <View className="bg-white rounded-2xl p-6" style={{elevation: 12}}>
            {/* Error Alert */}
            {error ? (
              <Alert type="error" message={error} style={{marginBottom: 16}} />
            ) : null}

            {/* Full Name Input */}
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                setError('');
              }}
              leftIcon={<Text style={{fontSize: 20}}>👤</Text>}
              editable={!loading}
            />

            {/* Email Input */}
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError('');
              }}
              leftIcon={<Text style={{fontSize: 20}}>📧</Text>}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />

            {/* Phone Input */}
            <Input
              label="Phone Number"
              placeholder="Enter your phone number"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                setError('');
              }}
              leftIcon={<Text style={{fontSize: 20}}>📱</Text>}
              keyboardType="phone-pad"
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

            {/* Confirm Password Input */}
            <Input
              label="Confirm Password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setError('');
              }}
              secureTextEntry={!showConfirmPassword}
              leftIcon={<Text style={{fontSize: 20}}>🔒</Text>}
              rightIcon={
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Text style={{fontSize: 20}}>
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </TouchableOpacity>
              }
              editable={!loading}
            />

            {/* Register Button */}
            <Button
              title={loading ? 'Creating Account...' : 'Register'}
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleRegister}
              disabled={loading}
              loading={loading}
              style={{marginTop: 8}}
            />

            {/* Login Link */}
            <View className="flex-row justify-center items-center mt-4">
              <Text className="text-gray-600 text-sm">Already have an account? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                disabled={loading}>
                <Text className="text-blue-600 text-sm font-bold">Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
