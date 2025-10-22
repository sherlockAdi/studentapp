import React, {useState} from 'react';
import {View, TouchableOpacity, Animated} from 'react-native';

const FloatingActionButton = ({
  icon,
  onPress,
  size = 56,
  backgroundColor = '#3B82F6',
  position = 'bottom-right',
  actions = [],
  style,
}) => {
  const [expanded, setExpanded] = useState(false);
  const animation = React.useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    const toValue = expanded ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
    setExpanded(!expanded);
  };

  const handlePress = () => {
    if (actions.length > 0) {
      toggleExpand();
    } else if (onPress) {
      onPress();
    }
  };

  const positions = {
    'bottom-right': {bottom: 16, right: 16},
    'bottom-left': {bottom: 16, left: 16},
    'top-right': {top: 16, right: 16},
    'top-left': {top: 16, left: 16},
  };

  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <View className="absolute" style={[positions[position], {zIndex: 999}, style]}>
      {/* Action Buttons */}
      {actions.map((action, index) => {
        const translateY = animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -(size + 16) * (index + 1)],
        });

        const opacity = animation.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 0, 1],
        });

        return (
          <Animated.View
            key={index}
            className="absolute items-center"
            style={{
              transform: [{translateY}],
              opacity,
              bottom: 0,
              right: 0,
            }}>
            <TouchableOpacity
              onPress={() => {
                if (action.onPress) action.onPress();
                toggleExpand();
              }}
              className="rounded-full items-center justify-center shadow-lg"
              style={{
                width: size * 0.75,
                height: size * 0.75,
                backgroundColor: action.backgroundColor || '#6B7280',
              }}>
              {action.icon}
            </TouchableOpacity>
          </Animated.View>
        );
      })}

      {/* Main FAB */}
      <TouchableOpacity
        onPress={handlePress}
        className="rounded-full items-center justify-center shadow-lg"
        style={[
          {
            width: size,
            height: size,
            backgroundColor,
          },
        ]}>
        <Animated.View style={{transform: [{rotate: rotation}]}}>
          {icon}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default FloatingActionButton;
