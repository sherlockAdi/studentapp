import React from 'react';
import {View, Text} from 'react-native';

const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = true,
  style,
}) => {
  const variants = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-600',
    success: 'bg-green-600',
    danger: 'bg-red-600',
    warning: 'bg-yellow-600',
    info: 'bg-cyan-600',
  };

  const sizes = {
    sm: {container: 'px-2 py-0.5', text: 'text-xs'},
    md: {container: 'px-2.5 py-1', text: 'text-sm'},
    lg: {container: 'px-3 py-1.5', text: 'text-base'},
  };

  return (
    <View
      className={`${variants[variant]} ${sizes[size].container} ${
        rounded ? 'rounded-full' : 'rounded'
      } items-center justify-center`}
      style={style}>
      <Text className={`${sizes[size].text} text-white font-semibold`}>
        {children}
      </Text>
    </View>
  );
};

export default Badge;
