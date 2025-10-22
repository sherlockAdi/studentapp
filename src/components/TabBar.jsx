import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';

const TabBar = ({
  tabs = [],
  activeIndex = 0,
  onChange,
  variant = 'underline',
  scrollable = false,
  backgroundColor = '#FFFFFF',
  activeColor = '#3B82F6',
  inactiveColor = '#6B7280',
  indicatorColor = '#3B82F6',
  style,
}) => {
  const variants = {
    underline: 'border-b border-gray-200',
    pills: 'bg-gray-100 rounded-lg p-1',
    segmented: 'border border-gray-300 rounded-lg overflow-hidden',
  };

  const TabContent = () => (
    <View className={`flex-row ${variants[variant]}`}>
      {tabs.map((tab, index) => {
        const isActive = index === activeIndex;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => onChange && onChange(index)}
            disabled={tab.disabled}
            className={`px-4 py-3 ${
              variant === 'pills' && isActive ? 'bg-white rounded-md shadow' : ''
            } ${
              variant === 'segmented' && isActive ? 'bg-blue-600' : ''
            } ${tab.disabled ? 'opacity-50' : ''}`}
            style={{
              flex: scrollable ? 0 : 1,
              minWidth: scrollable ? 100 : undefined,
              borderRightWidth: variant === 'segmented' && index < tabs.length - 1 ? 1 : 0,
              borderRightColor: '#D1D5DB',
            }}>
            {/* Icon */}
            {tab.icon && (
              <View className="items-center mb-1">{tab.icon}</View>
            )}

            {/* Label */}
            <Text
              className={`text-center font-semibold ${
                variant === 'segmented' && isActive ? 'text-white' : ''
              }`}
              style={{
                color:
                  variant === 'segmented' && isActive
                    ? '#FFFFFF'
                    : isActive
                    ? activeColor
                    : inactiveColor,
              }}
              numberOfLines={1}>
              {tab.label}
            </Text>

            {/* Badge */}
            {tab.badge && (
              <View className="absolute top-1 right-1 bg-red-600 rounded-full px-1.5 py-0.5">
                <Text className="text-white text-xs font-bold">{tab.badge}</Text>
              </View>
            )}

            {/* Underline Indicator */}
            {variant === 'underline' && isActive && (
              <View
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{backgroundColor: indicatorColor}}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[{backgroundColor}, style]}>
        <TabContent />
      </ScrollView>
    );
  }

  return (
    <View style={[{backgroundColor}, style]}>
      <TabContent />
    </View>
  );
};

export default TabBar;
