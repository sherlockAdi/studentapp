import React from 'react';
import {View, Text} from 'react-native';

const ProgressBar = ({
  progress = 0,
  height = 8,
  color = '#3B82F6',
  backgroundColor = '#E5E7EB',
  showLabel = false,
  animated = true,
  style,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View style={style}>
      <View
        className="rounded-full overflow-hidden"
        style={{height, backgroundColor}}>
        <View
          className={`h-full rounded-full ${animated ? 'transition-all' : ''}`}
          style={{
            width: `${clampedProgress}%`,
            backgroundColor: color,
          }}
        />
      </View>
      {showLabel && (
        <Text className="text-gray-600 text-sm mt-1 text-center">
          {clampedProgress.toFixed(0)}%
        </Text>
      )}
    </View>
  );
};

export default ProgressBar;
