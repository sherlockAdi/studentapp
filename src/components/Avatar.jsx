import React from 'react';
import {View, Text, Image} from 'react-native';

const Avatar = ({
  source,
  name,
  size = 'md',
  rounded = true,
  backgroundColor = '#3B82F6',
  style,
}) => {
  const sizes = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    '2xl': 'w-24 h-24',
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl',
    '2xl': 'text-3xl',
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <View
      className={`${sizes[size]} ${
        rounded ? 'rounded-full' : 'rounded-lg'
      } items-center justify-center overflow-hidden`}
      style={[{backgroundColor: source ? 'transparent' : backgroundColor}, style]}>
      {source ? (
        <Image source={source} className="w-full h-full" resizeMode="cover" />
      ) : (
        <Text className={`${textSizes[size]} text-white font-bold`}>
          {getInitials(name)}
        </Text>
      )}
    </View>
  );
};

export default Avatar;
