import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePicker = ({
  label,
  value = new Date(),
  onChange,
  mode = 'date',
  placeholder = 'Select date',
  error,
  disabled = false,
  minimumDate,
  maximumDate,
  style,
}) => {
  const [show, setShow] = useState(false);

  const handleChange = (event, selectedDate) => {
    setShow(Platform.OS === 'ios');
    if (selectedDate && onChange) {
      onChange(selectedDate);
    }
  };

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

  return (
    <View className="mb-4" style={style}>
      {label && (
        <Text className="text-gray-700 text-sm font-semibold mb-2">{label}</Text>
      )}
      <TouchableOpacity
        onPress={() => !disabled && setShow(true)}
        disabled={disabled}
        className={`border rounded-lg px-3 py-3 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100' : 'bg-white'}`}>
        <Text className={value ? 'text-gray-900' : 'text-gray-400'}>
          {formatDate(value)}
        </Text>
      </TouchableOpacity>
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}

      {show && (
        <DateTimePicker
          value={value}
          mode={mode}
          display="default"
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
    </View>
  );
};

export default DatePicker;
