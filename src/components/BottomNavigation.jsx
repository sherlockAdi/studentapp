import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

const BottomNavigation = ({
  items = [],
  activeIndex = 0,
  onChange,
  height = 65,
  backgroundColor = '#FFFFFF',
  activeColor = '#3B82F6',
  inactiveColor = '#9CA3AF',
  showLabels = true,
  style,
}) => {
  return (
    <View
      className="flex-row border-t border-gray-200"
      style={[
        {
          height,
          backgroundColor,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: -2},
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 8,
        },
        style,
      ]}>
      {items.map((item, index) => {
        const isActive = index === activeIndex;
        const color = isActive ? activeColor : inactiveColor;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => onChange && onChange(index)}
            disabled={item.disabled}
            className="flex-1 items-center justify-center"
            style={{opacity: item.disabled ? 0.5 : 1}}>
            {/* Badge */}
            {item.badge && (
              <View
                className="absolute top-2 bg-red-600 rounded-full px-1.5 py-0.5"
                style={{right: '30%', zIndex: 1}}>
                <Text className="text-white text-xs font-bold">{item.badge}</Text>
              </View>
            )}

            {/* Icon */}
            <View className="mb-1">{item.icon}</View>

            {/* Label */}
            {showLabels && (
              <Text
                className="text-xs font-semibold"
                style={{color}}
                numberOfLines={1}>
                {item.label}
              </Text>
            )}

            {/* Active Indicator */}
            {isActive && (
              <View
                className="absolute top-0 left-0 right-0 h-1 rounded-b-full"
                style={{backgroundColor: activeColor}}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomNavigation;
