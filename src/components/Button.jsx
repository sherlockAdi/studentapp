import React from 'react';
import {TouchableOpacity, Text, ActivityIndicator, View} from 'react-native';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
}) => {
  const variants = {
    primary: 'bg-blue-600 active:bg-blue-700',
    secondary: 'bg-gray-600 active:bg-gray-700',
    success: 'bg-green-600 active:bg-green-700',
    danger: 'bg-red-600 active:bg-red-700',
    warning: 'bg-yellow-600 active:bg-yellow-700',
    outline: 'bg-transparent border-2 border-blue-600',
    ghost: 'bg-transparent',
  };

  const sizes = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
    xl: 'px-8 py-5',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const textColors = {
    primary: 'text-white',
    secondary: 'text-white',
    success: 'text-white',
    danger: 'text-white',
    warning: 'text-white',
    outline: 'text-blue-600',
    ghost: 'text-blue-600',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${variants[variant]} ${sizes[size]} rounded-lg items-center justify-center flex-row ${
        fullWidth ? 'w-full' : ''
      } ${disabled ? 'opacity-50' : ''}`}
      style={style}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? '#2563eb' : '#fff'}
        />
      ) : (
        <View className="flex-row items-center justify-center">
          {icon && iconPosition === 'left' && <View className="mr-2">{icon}</View>}
          <Text className={`${textColors[variant]} ${textSizes[size]} font-semibold`} style={textStyle}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && <View className="ml-2">{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;
