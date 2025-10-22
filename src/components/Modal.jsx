import React from 'react';
import {Modal as RNModal, View, Text, TouchableOpacity, ScrollView} from 'react-native';

const Modal = ({
  visible = false,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
  animationType = 'fade',
  style,
}) => {
  const sizes = {
    sm: 'w-3/4',
    md: 'w-11/12',
    lg: 'w-full mx-4',
    full: 'w-full h-full',
  };

  return (
    <RNModal
      visible={visible}
      transparent={size !== 'full'}
      animationType={animationType}
      onRequestClose={onClose}>
      <View className={`flex-1 ${size === 'full' ? '' : 'bg-black/50 justify-center items-center'}`}>
        <View
          className={`${sizes[size]} ${
            size === 'full' ? 'flex-1' : 'max-h-5/6'
          } bg-white rounded-xl overflow-hidden`}
          style={style}>
          {/* Header */}
          {(title || showCloseButton) && (
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <Text className="text-xl font-bold text-gray-900 flex-1">{title}</Text>
              {showCloseButton && (
                <TouchableOpacity onPress={onClose} className="ml-2">
                  <Text className="text-2xl text-gray-600">×</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Content */}
          <ScrollView className="flex-1 p-4">{children}</ScrollView>

          {/* Footer */}
          {footer && (
            <View className="p-4 border-t border-gray-200">{footer}</View>
          )}
        </View>
      </View>
    </RNModal>
  );
};

export default Modal;
