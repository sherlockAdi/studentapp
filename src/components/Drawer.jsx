import React from 'react';
import {View, Text, TouchableOpacity, ScrollView, Animated} from 'react-native';

const Drawer = ({
  visible = false,
  onClose,
  position = 'left',
  width = '80%',
  children,
  overlayColor = 'rgba(0, 0, 0, 0.5)',
  style,
}) => {
  const translateX = React.useRef(new Animated.Value(position === 'left' ? -300 : 300)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      Animated.timing(translateX, {
        toValue: position === 'left' ? -300 : 300,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View className="absolute inset-0" style={{zIndex: 1000}}>
      {/* Overlay */}
      <TouchableOpacity
        className="absolute inset-0"
        activeOpacity={1}
        onPress={onClose}
        style={{backgroundColor: overlayColor}}
      />

      {/* Drawer Content */}
      <Animated.View
        className="absolute top-0 bottom-0 bg-white shadow-lg"
        style={[
          {
            width: typeof width === 'string' ? width : width,
            [position]: 0,
            transform: [{translateX}],
          },
          style,
        ]}>
        <ScrollView className="flex-1">{children}</ScrollView>
      </Animated.View>
    </View>
  );
};

export default Drawer;
