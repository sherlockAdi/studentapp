import React from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';

const ListItem = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onPress,
  disabled = false,
  style,
}) => {
  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      onPress={onPress}
      disabled={disabled}
      className={`flex-row items-center p-4 border-b border-gray-200 ${
        disabled ? 'opacity-50' : ''
      }`}
      style={style}>
      {leftIcon && <View className="mr-3">{leftIcon}</View>}
      <View className="flex-1">
        <Text className="text-gray-900 text-base font-semibold">{title}</Text>
        {subtitle && <Text className="text-gray-600 text-sm mt-1">{subtitle}</Text>}
      </View>
      {rightIcon && <View className="ml-3">{rightIcon}</View>}
    </Component>
  );
};

const List = ({
  data = [],
  renderItem,
  keyExtractor,
  emptyText = 'No items found',
  style,
}) => {
  if (data.length === 0) {
    return (
      <View className="p-8 items-center justify-center" style={style}>
        <Text className="text-gray-500 text-base">{emptyText}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      style={style}
    />
  );
};

List.Item = ListItem;

export default List;
