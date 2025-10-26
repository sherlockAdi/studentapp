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
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ padding: 24, flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center">
      
      
       <Text className="text-center font-semibold mb-16" style={{color: '#000000', fontSize: 16, letterSpacing: 3}}> LOGIN </Text> 
       <Text className="text-center font-bold mb-20" style={{color: '#000000', fontSize: 48}}> Healthcare </Text>
          {/* Email Input */}
          <View className="mb-6">
            <Text className="text-sm font-medium mb-2 text-gray-700">
              Email
            </Text>
            <View
              className="flex-row items-center bg-gray-50"
              style={{
                borderWidth: 1,
                borderColor: "#E5E7EB",
                borderRadius: 14,
                paddingHorizontal: 14,
                height: 55,
              }}
            >
              <Text className="text-xl mr-3">📧</Text>
              <TextInput
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError("");
                }}
                placeholder="Enter your email"
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
                className="flex-1 text-black"
                placeholderTextColor="#A1A1A1"
                style={{ fontSize: 16 }}
              />
            </View>
          </View>

          {/* Password Input */}
          <View className="mb-2">
            <Text className="text-sm font-medium mb-2 text-gray-700">
              Password
            </Text>
            <View
              className="flex-row items-center bg-gray-50"
              style={{
                borderWidth: 1,
                borderColor: "#E5E7EB",
                borderRadius: 14,
                paddingHorizontal: 14,
                height: 55,
              }}
            >
              <Text className="text-xl mr-3">🔐</Text>
              <TextInput
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError("");
                }}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                editable={!loading}
                className="flex-1 text-black"
                placeholderTextColor="#A1A1A1"
                style={{ fontSize: 16 }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text className="text-lg">
                  {showPassword ? "🙈" : "👁️"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity className="items-end mb-8">
            <Text className="text-sm font-semibold text-blue-600">
              Forgot password?
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
           onPress={handleLogin}
            disabled={loading}
            className="items-center justify-center"
            style={{
              backgroundColor: "#2563EB",
              borderRadius: 14,
              paddingVertical: 16,
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 5,
              elevation: 3,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "white",
                letterSpacing: 1,
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>

          {/* Signup Redirect */}
          <View className="flex-row justify-center items-center mt-10">
            <Text className="text-sm text-gray-600">New here? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text className="text-sm font-semibold text-blue-600">
                Create Account
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
