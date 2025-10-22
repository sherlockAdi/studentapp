import React from 'react';
import {TouchableOpacity, View, Text} from 'react-native';

const Checkbox = ({
  checked = false,
  onChange,
  label,
  disabled = false,
  size = 'md',
  color = 'blue',
  style,
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const colors = {
    blue: 'bg-blue-600 border-blue-600',
    green: 'bg-green-600 border-green-600',
    red: 'bg-red-600 border-red-600',
    purple: 'bg-purple-600 border-purple-600',
  };

  return (
    <TouchableOpacity
      onPress={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className="flex-row items-center"
      style={style}>
      <View
        className={`${sizes[size]} border-2 rounded ${
          checked ? colors[color] : 'border-gray-400 bg-white'
        } ${disabled ? 'opacity-50' : ''} items-center justify-center`}>
        {checked && (
          <View className="w-2 h-3 border-r-2 border-b-2 border-white transform rotate-45" />
        )}
      </View>
      {label && (
        <Text className={`ml-2 text-gray-900 ${disabled ? 'opacity-50' : ''}`}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Checkbox;
