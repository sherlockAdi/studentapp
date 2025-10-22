import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

const Slider = ({
  value = 0,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  label,
  showValue = true,
  minimumTrackTintColor = '#3B82F6',
  maximumTrackTintColor = '#E5E7EB',
  disabled = false,
  style,
}) => {
  const handleIncrement = () => {
    if (!disabled && onValueChange) {
      const newValue = Math.min(value + step, maximumValue);
      onValueChange(newValue);
    }
  };

  const handleDecrement = () => {
    if (!disabled && onValueChange) {
      const newValue = Math.max(value - step, minimumValue);
      onValueChange(newValue);
    }
  };

  const percentage = ((value - minimumValue) / (maximumValue - minimumValue)) * 100;

  return (
    <View className="mb-4" style={style}>
      {label && (
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-gray-700 text-sm font-semibold">{label}</Text>
          {showValue && (
            <Text className="text-gray-600 text-sm">{value.toFixed(0)}</Text>
          )}
        </View>
      )}
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={handleDecrement}
          disabled={disabled || value <= minimumValue}
          className={`w-8 h-8 rounded-full bg-blue-600 items-center justify-center ${
            disabled || value <= minimumValue ? 'opacity-50' : ''
          }`}>
          <Text className="text-white text-xl font-bold">−</Text>
        </TouchableOpacity>
        <View className="flex-1 mx-3">
          <View
            className="h-2 rounded-full"
            style={{backgroundColor: maximumTrackTintColor}}>
            <View
              className="h-2 rounded-full"
              style={{
                width: `${percentage}%`,
                backgroundColor: minimumTrackTintColor,
              }}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={handleIncrement}
          disabled={disabled || value >= maximumValue}
          className={`w-8 h-8 rounded-full bg-blue-600 items-center justify-center ${
            disabled || value >= maximumValue ? 'opacity-50' : ''
          }`}>
          <Text className="text-white text-xl font-bold">+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Slider;
