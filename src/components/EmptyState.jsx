import React from 'react';
import {View, Text} from 'react-native';
import Button from './Button';

const EmptyState = ({
  icon,
  title = 'No data found',
  description,
  actionLabel,
  onActionPress,
  style,
}) => {
  return (
    <View className="flex-1 items-center justify-center p-8" style={style}>
      {/* Icon */}
      {icon && <View className="mb-4">{icon}</View>}

      {/* Title */}
      <Text className="text-xl font-bold text-gray-900 text-center mb-2">
        {title}
      </Text>

      {/* Description */}
      {description && (
        <Text className="text-base text-gray-600 text-center mb-6">
          {description}
        </Text>
      )}

      {/* Action Button */}
      {actionLabel && onActionPress && (
        <Button
          title={actionLabel}
          variant="primary"
          onPress={onActionPress}
        />
      )}
    </View>
  );
};

export default EmptyState;
