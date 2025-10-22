import React, {useState} from 'react';
import {View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager} from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Accordion = ({
  title,
  children,
  defaultExpanded = false,
  icon,
  style,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View className="border border-gray-300 rounded-lg mb-2 overflow-hidden" style={style}>
      <TouchableOpacity
        onPress={toggleExpanded}
        className="flex-row justify-between items-center p-4 bg-gray-50"
        activeOpacity={0.7}>
        <View className="flex-row items-center flex-1">
          {icon && <View className="mr-2">{icon}</View>}
          <Text className="text-gray-900 text-base font-semibold flex-1">{title}</Text>
        </View>
        <Text className="text-gray-600 text-xl">{expanded ? '−' : '+'}</Text>
      </TouchableOpacity>
      {expanded && <View className="p-4 bg-white">{children}</View>}
    </View>
  );
};

export default Accordion;
