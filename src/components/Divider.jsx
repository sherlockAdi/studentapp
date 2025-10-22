import React from 'react';
import {View, Text} from 'react-native';

const Divider = ({
  text,
  orientation = 'horizontal',
  thickness = 1,
  color = '#E5E7EB',
  marginVertical = 4,
  marginHorizontal = 0,
  style,
}) => {
  if (orientation === 'vertical') {
    return (
      <View
        className={`mx-${marginHorizontal}`}
        style={[{width: thickness, backgroundColor: color, height: '100%'}, style]}
      />
    );
  }

  if (text) {
    return (
      <View className={`flex-row items-center my-${marginVertical}`} style={style}>
        <View className="flex-1" style={{height: thickness, backgroundColor: color}} />
        <Text className="mx-4 text-gray-500 text-sm">{text}</Text>
        <View className="flex-1" style={{height: thickness, backgroundColor: color}} />
      </View>
    );
  }

  return (
    <View
      className={`my-${marginVertical}`}
      style={[{height: thickness, backgroundColor: color}, style]}
    />
  );
};

export default Divider;
