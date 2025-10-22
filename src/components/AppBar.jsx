import React from 'react';
import {View, Text, TouchableOpacity, StatusBar} from 'react-native';

const AppBar = ({
  title,
  subtitle,
  leftIcon,
  rightIcons = [],
  onLeftIconPress,
  backgroundColor = '#3B82F6',
  textColor = '#FFFFFF',
  height = 56,
  elevation = 4,
  statusBarColor,
  style,
}) => {
  return (
    <>
      <StatusBar
        backgroundColor={statusBarColor || backgroundColor}
        barStyle={textColor === '#FFFFFF' ? 'light-content' : 'dark-content'}
      />
      <View
        className="flex-row items-center px-4"
        style={[
          {
            height,
            backgroundColor,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation,
          },
          style,
        ]}>
        {/* Left Icon */}
        {leftIcon && (
          <TouchableOpacity
            onPress={onLeftIconPress}
            className="mr-4 p-2 -ml-2"
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            {leftIcon}
          </TouchableOpacity>
        )}

        {/* Title */}
        <View className="flex-1">
          <Text
            className="text-lg font-bold"
            style={{color: textColor}}
            numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text
              className="text-xs"
              style={{color: textColor, opacity: 0.8}}
              numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right Icons */}
        {rightIcons.map((iconConfig, index) => (
          <TouchableOpacity
            key={index}
            onPress={iconConfig.onPress}
            className="ml-4 p-2 -mr-2"
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            {iconConfig.icon}
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
};

export default AppBar;
