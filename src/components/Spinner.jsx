import React from 'react';
import {View, ActivityIndicator, Text} from 'react-native';

const Spinner = ({
  size = 'large',
  color = '#3B82F6',
  text,
  fullScreen = false,
  style,
}) => {
  const content = (
    <View className="items-center justify-center" style={style}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text className="mt-2 text-gray-600 text-base">{text}</Text>}
    </View>
  );

  if (fullScreen) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        {content}
      </View>
    );
  }

  return content;
};

export default Spinner;
