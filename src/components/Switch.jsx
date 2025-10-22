import React from 'react';
import {Switch as RNSwitch, View, Text} from 'react-native';

const Switch = ({
  value = false,
  onValueChange,
  label,
  disabled = false,
  color = '#3B82F6',
  style,
}) => {
  return (
    <View className="flex-row items-center justify-between" style={style}>
      {label && (
        <Text className={`text-gray-900 text-base ${disabled ? 'opacity-50' : ''}`}>
          {label}
        </Text>
      )}
      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{false: '#D1D5DB', true: color}}
        thumbColor={value ? '#FFFFFF' : '#F3F4F6'}
        ios_backgroundColor="#D1D5DB"
      />
    </View>
  );
};

export default Switch;
