import React, {useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, Modal, Animated, Dimensions, PanResponder} from 'react-native';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const BottomSheet = ({
  visible = false,
  onClose,
  title,
  children,
  height = SCREEN_HEIGHT * 0.6,
  showHandle = true,
  style,
}) => {
  const translateY = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > height * 0.3) {
          onClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-end">
        <TouchableOpacity
          className="flex-1"
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          className="bg-white rounded-t-3xl"
          style={[
            {
              height,
              transform: [{translateY}],
            },
            style,
          ]}
          {...(showHandle ? panResponder.panHandlers : {})}>
          {showHandle && (
            <View className="items-center py-3">
              <View className="w-12 h-1 bg-gray-300 rounded-full" />
            </View>
          )}
          {title && (
            <View className="px-6 pb-4 border-b border-gray-200">
              <Text className="text-xl font-bold text-gray-900">{title}</Text>
            </View>
          )}
          <View className="flex-1 px-6 py-4">{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default BottomSheet;
