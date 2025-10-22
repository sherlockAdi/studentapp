import React from 'react';
import {View, Text, TouchableOpacity, ScrollView, Modal} from 'react-native';

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
  const positionStyle = position === 'left' ? {left: 0} : {right: 0};

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View className="flex-1 flex-row" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
        {/* Backdrop */}
        <TouchableOpacity
          className="flex-1"
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Sidebar */}
        <View
          className="bg-white h-full shadow-lg"
          style={[
            positionStyle,
            {width, position: 'absolute', top: 0, bottom: 0},
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
        </View>
      </View>
    </Modal>
  );
};

export default Sidebar;
