import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';

const Tabs = ({
  tabs = [],
  defaultTab = 0,
  onChange,
  variant = 'underline',
  style,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (index) => {
    setActiveTab(index);
    if (onChange) onChange(index);
  };

  const variants = {
    underline: {
      container: 'border-b border-gray-300',
      tab: 'px-4 py-3',
      activeTab: 'border-b-2 border-blue-600',
      text: 'text-gray-600',
      activeText: 'text-blue-600',
    },
    pills: {
      container: 'bg-gray-100 rounded-lg p-1',
      tab: 'px-4 py-2 rounded-md',
      activeTab: 'bg-white shadow',
      text: 'text-gray-600',
      activeText: 'text-blue-600',
    },
  };

  const config = variants[variant];

  return (
    <View style={style}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className={config.container}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleTabChange(index)}
            className={`${config.tab} ${activeTab === index ? config.activeTab : ''}`}>
            <Text
              className={`font-semibold ${
                activeTab === index ? config.activeText : config.text
              }`}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View className="mt-4">{tabs[activeTab]?.content}</View>
    </View>
  );
};

export default Tabs;
