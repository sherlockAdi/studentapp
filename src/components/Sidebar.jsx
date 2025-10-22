import React, {useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Modal, Animated} from 'react-native';

const Sidebar = ({
  visible = false,
  onClose,
  position = 'left',
  width = 280,
  header,
  footer,
  items = [],
  style,
}) => {
  const translateX = useRef(new Animated.Value(position === 'left' ? -width : width)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: position === 'left' ? -width : width,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View className="absolute inset-0" style={{zIndex: 1000}}>
      {/* Backdrop */}
      <Animated.View
        className="absolute inset-0"
        style={{backgroundColor: 'rgba(0, 0, 0, 0.5)', opacity}}>
        <TouchableOpacity
          className="flex-1"
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>

      {/* Sidebar */}
      <Animated.View
        className="bg-white shadow-lg"
        style={[
          {
            width,
            position: 'absolute',
            top: 0,
            bottom: 0,
            [position]: 0,
            transform: [{translateX}],
            shadowColor: '#000',
            shadowOffset: {width: position === 'left' ? 2 : -2, height: 0},
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 16,
          },
          style,
        ]}>
          {/* Header */}
          {header && (
            <View className="p-4 border-b border-gray-200 bg-blue-600">
              {header}
            </View>
          )}

          {/* Menu Items */}
          <ScrollView className="flex-1">
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  if (item.onPress) item.onPress();
                  if (item.closeOnPress !== false) onClose();
                }}
                disabled={item.disabled}
                className={`flex-row items-center p-4 border-b border-gray-100 ${
                  item.active ? 'bg-blue-50' : ''
                } ${item.disabled ? 'opacity-50' : ''}`}>
                {item.icon && <View className="mr-3">{item.icon}</View>}
                <View className="flex-1">
                  <Text
                    className={`text-base ${
                      item.active ? 'text-blue-600 font-semibold' : 'text-gray-900'
                    }`}>
                    {item.label}
                  </Text>
                  {item.subtitle && (
                    <Text className="text-sm text-gray-600 mt-1">{item.subtitle}</Text>
                  )}
                </View>
                {item.badge && (
                  <View className="bg-red-600 rounded-full px-2 py-0.5 ml-2">
                    <Text className="text-white text-xs font-bold">{item.badge}</Text>
                  </View>
                )}
                {item.rightIcon && <View className="ml-2">{item.rightIcon}</View>}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Footer */}
          {footer && (
            <View className="p-4 border-t border-gray-200 bg-gray-50">
              {footer}
            </View>
          )}
        </Animated.View>
      </View>
  );
};

export default Sidebar;
