import React from 'react';
import {View, ScrollView, SafeAreaView} from 'react-native';

const Container = ({
  children,
  padding = 'md',
  safe = true,
  scrollable = false,
  centered = false,
  style,
}) => {
  const paddings = {
    none: '',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  const content = (
    <View
      className={`flex-1 ${paddings[padding]} ${centered ? 'justify-center items-center' : ''}`}
      style={style}>
      {children}
    </View>
  );

  if (scrollable) {
    return safe ? (
      <SafeAreaView className="flex-1">
        <ScrollView className={paddings[padding]} style={style}>
          {children}
        </ScrollView>
      </SafeAreaView>
    ) : (
      <ScrollView className={paddings[padding]} style={style}>
        {children}
      </ScrollView>
    );
  }

  return safe ? <SafeAreaView className="flex-1">{content}</SafeAreaView> : content;
};

export default Container;
