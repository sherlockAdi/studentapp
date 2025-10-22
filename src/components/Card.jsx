import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

const Card = ({
  children,
  title,
  subtitle,
  footer,
  onPress,
  variant = 'elevated',
  padding = 'md',
  style,
}) => {
  const variants = {
    elevated: 'bg-white shadow-lg',
    outlined: 'bg-white border border-gray-300',
    filled: 'bg-gray-100',
  };

  const paddings = {
    none: '',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  const CardContent = () => (
    <View className={`${variants[variant]} rounded-xl ${paddings[padding]}`} style={style}>
      {title && (
        <View className="mb-3">
          <Text className="text-xl font-bold text-gray-900">{title}</Text>
          {subtitle && <Text className="text-sm text-gray-600 mt-1">{subtitle}</Text>}
        </View>
      )}
      {children}
      {footer && <View className="mt-3 pt-3 border-t border-gray-200">{footer}</View>}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
};

export default Card;
