import React, {useEffect, useRef} from 'react';
import {View, Text, Animated} from 'react-native';

const Toast = ({
  visible = false,
  message,
  type = 'info',
  duration = 3000,
  onHide,
  position = 'top',
  style,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(position === 'top' ? -100 : 100)).current;

  const types = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-yellow-600',
    info: 'bg-blue-600',
  };

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: position === 'top' ? -100 : 100,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (onHide) onHide();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      className={`absolute ${position === 'top' ? 'top-12' : 'bottom-12'} left-4 right-4 z-50`}
      style={[
        {
          opacity,
          transform: [{translateY}],
        },
        style,
      ]}>
      <View className={`${types[type]} p-4 rounded-lg shadow-lg`}>
        <Text className="text-white text-base font-semibold">{message}</Text>
      </View>
    </Animated.View>
  );
};

export default Toast;
