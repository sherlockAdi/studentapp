import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

const Chip = ({
  label,
  onPress,
  onDelete,
  variant = 'filled',
  color = 'blue',
  size = 'md',
  icon,
  style,
}) => {
  const variants = {
    filled: {
      blue: 'bg-blue-600',
      green: 'bg-green-600',
      red: 'bg-red-600',
      gray: 'bg-gray-600',
    },
    outlined: {
      blue: 'border-2 border-blue-600 bg-transparent',
      green: 'border-2 border-green-600 bg-transparent',
      red: 'border-2 border-red-600 bg-transparent',
      gray: 'border-2 border-gray-600 bg-transparent',
    },
  };

  const textColors = {
    filled: 'text-white',
    outlined: {
      blue: 'text-blue-600',
      green: 'text-green-600',
      red: 'text-red-600',
      gray: 'text-gray-600',
    },
  };

  const sizes = {
    sm: {container: 'px-2 py-1', text: 'text-xs'},
    md: {container: 'px-3 py-1.5', text: 'text-sm'},
    lg: {container: 'px-4 py-2', text: 'text-base'},
  };

  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      onPress={onPress}
      className={`${
        variant === 'filled' ? variants[variant][color] : variants[variant][color]
      } ${sizes[size].container} rounded-full flex-row items-center`}
      style={style}>
      {icon && <View className="mr-1">{icon}</View>}
      <Text
        className={`${
          variant === 'filled' ? textColors.filled : textColors.outlined[color]
        } ${sizes[size].text} font-semibold`}>
        {label}
      </Text>
      {onDelete && (
        <TouchableOpacity onPress={onDelete} className="ml-2">
          <Text
            className={`${
              variant === 'filled' ? 'text-white' : textColors.outlined[color]
            } text-base`}>
            ×
          </Text>
        </TouchableOpacity>
      )}
    </Component>
  );
};

export default Chip;
