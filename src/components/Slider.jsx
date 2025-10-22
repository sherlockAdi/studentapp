import React from 'react';
import {View, Text} from 'react-native';
import Slider as RNSlider from '@react-native-community/slider';

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
  thumbTintColor = '#3B82F6',
  disabled = false,
  style,
}) => {
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
      <RNSlider
        value={value}
        onValueChange={onValueChange}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        minimumTrackTintColor={minimumTrackTintColor}
        maximumTrackTintColor={maximumTrackTintColor}
        thumbTintColor={thumbTintColor}
        disabled={disabled}
      />
    </View>
  );
};

export default Slider;
