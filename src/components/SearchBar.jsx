import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity, Text} from 'react-native';

const SearchBar = ({
  placeholder = 'Search...',
  value,
  onChangeText,
  onSearch,
  onClear,
  leftIcon,
  autoFocus = false,
  style,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    if (onChangeText) onChangeText('');
    if (onClear) onClear();
  };

  return (
    <View
      className={`flex-row items-center border rounded-full px-4 py-2 ${
        isFocused ? 'border-blue-500' : 'border-gray-300'
      } bg-white`}
      style={style}>
      {leftIcon ? (
        <View className="mr-2">{leftIcon}</View>
      ) : (
        <Text className="mr-2 text-gray-400 text-lg">🔍</Text>
      )}
      <TextInput
        className="flex-1 text-gray-900 text-base"
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSearch}
        autoFocus={autoFocus}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        returnKeyType="search"
      />
      {value && value.length > 0 && (
        <TouchableOpacity onPress={handleClear} className="ml-2">
          <Text className="text-gray-400 text-xl">×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
