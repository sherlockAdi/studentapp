import React from 'react';
import {View, Text} from 'react-native';

const Alert = ({
  type = 'info',
  title,
  message,
  icon,
  onClose,
  style,
}) => {
  const types = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-500',
      text: 'text-green-800',
      icon: '✓',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      text: 'text-red-800',
      icon: '✕',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-500',
      text: 'text-yellow-800',
      icon: '⚠',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      text: 'text-blue-800',
      icon: 'ℹ',
    },
  };

  const config = types[type];

  return (
    <View
      className={`${config.bg} ${config.border} border-l-4 p-4 rounded-lg mb-4`}
      style={style}>
      <View className="flex-row items-start">
        {icon !== false && (
          <Text className={`${config.text} text-xl mr-3`}>
            {icon || config.icon}
          </Text>
        )}
        <View className="flex-1">
          {title && (
            <Text className={`${config.text} font-bold text-base mb-1`}>{title}</Text>
          )}
          {message && (
            <Text className={`${config.text} text-sm`}>{message}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default Alert;
