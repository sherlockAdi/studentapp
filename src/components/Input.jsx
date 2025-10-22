import React, {useState} from 'react';
import {View, TextInput, Text, TouchableOpacity} from 'react-native';

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  helperText,
  disabled = false,
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  leftIcon,
  rightIcon,
  onRightIconPress,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  maxLength,
  editable = true,
  style,
  inputStyle,
  containerStyle,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-4" style={containerStyle}>
      {label && (
        <Text className="text-gray-700 text-sm font-semibold mb-2">{label}</Text>
      )}
      <View
        className={`flex-row items-center border rounded-lg px-3 ${
          error
            ? 'border-red-500'
            : isFocused
            ? 'border-blue-500'
            : 'border-gray-300'
        } ${disabled ? 'bg-gray-100' : 'bg-white'}`}
        style={style}>
        {leftIcon && <View className="mr-2">{leftIcon}</View>}
        <TextInput
          className={`flex-1 py-3 text-gray-900 ${multiline ? 'min-h-[100px]' : ''}`}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable && !disabled}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={inputStyle}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} disabled={!onRightIconPress}>
            <View className="ml-2">{rightIcon}</View>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
      {helperText && !error && (
        <Text className="text-gray-500 text-xs mt-1">{helperText}</Text>
      )}
    </View>
  );
};

export default Input;
