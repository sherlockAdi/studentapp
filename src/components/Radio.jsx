import React from 'react';
import {TouchableOpacity, View, Text} from 'react-native';

const Radio = ({
  selected = false,
  onSelect,
  label,
  disabled = false,
  size = 'md',
  color = 'blue',
  style,
}) => {
  const sizes = {
    sm: {outer: 'w-4 h-4', inner: 'w-2 h-2'},
    md: {outer: 'w-5 h-5', inner: 'w-2.5 h-2.5'},
    lg: {outer: 'w-6 h-6', inner: 'w-3 h-3'},
  };

  const colors = {
    blue: 'bg-blue-600 border-blue-600',
    green: 'bg-green-600 border-green-600',
    red: 'bg-red-600 border-red-600',
    purple: 'bg-purple-600 border-purple-600',
  };

  return (
    <TouchableOpacity
      onPress={() => !disabled && onSelect()}
      disabled={disabled}
      className="flex-row items-center"
      style={style}>
      <View
        className={`${sizes[size].outer} border-2 rounded-full ${
          selected ? colors[color] : 'border-gray-400 bg-white'
        } ${disabled ? 'opacity-50' : ''} items-center justify-center`}>
        {selected && (
          <View className={`${sizes[size].inner} rounded-full bg-white`} />
        )}
      </View>
      {label && (
        <Text className={`ml-2 text-gray-900 ${disabled ? 'opacity-50' : ''}`}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Radio;
