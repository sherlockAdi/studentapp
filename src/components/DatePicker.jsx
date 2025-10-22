import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

const DatePicker = ({
  label,
  value = new Date(),
  onChange,
  mode = 'date',
  placeholder = 'Select date',
  error,
  disabled = false,
  style,
}) => {
  const formatDate = (date) => {
    if (!date) return placeholder;
    if (mode === 'time') {
      return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    }
    if (mode === 'datetime') {
      return date.toLocaleString();
    }
    return date.toLocaleDateString();
  };

  const handlePress = () => {
    if (!disabled && onChange) {
      // For demo purposes, set to current date/time
      onChange(new Date());
    }
  };

  return (
    <View className="mb-4" style={style}>
      {label && (
        <Text className="text-gray-700 text-sm font-semibold mb-2">{label}</Text>
      )}
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        className={`border rounded-lg px-3 py-3 flex-row justify-between items-center ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100' : 'bg-white'}`}>
        <Text className={value ? 'text-gray-900' : 'text-gray-400'}>
          {formatDate(value)}
        </Text>
        <Text className="text-gray-600">📅</Text>
      </TouchableOpacity>
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
};

export default DatePicker;
