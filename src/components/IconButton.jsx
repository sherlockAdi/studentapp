import React from 'react';
import {TouchableOpacity, View} from 'react-native';

const IconButton = ({
  icon,
  onPress,
  size = 'md',
  variant = 'default',
  disabled = false,
  style,
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14',
  };

  const variants = {
    default: 'bg-transparent',
    filled: 'bg-blue-600',
    outlined: 'border-2 border-blue-600 bg-transparent',
    ghost: 'bg-gray-100',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`${sizes[size]} ${variants[variant]} rounded-full items-center justify-center ${
        disabled ? 'opacity-50' : ''
      }`}
      style={style}>
      <View>{icon}</View>
    </TouchableOpacity>
  );
};

export default IconButton;
