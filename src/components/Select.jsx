import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Modal, FlatList} from 'react-native';

const Select = ({
  label,
  placeholder = 'Select an option',
  value,
  options = [],
  onChange,
  error,
  disabled = false,
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <View className="mb-4" style={style}>
      {label && (
        <Text className="text-gray-700 text-sm font-semibold mb-2">{label}</Text>
      )}
      <TouchableOpacity
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        className={`border rounded-lg px-3 py-3 flex-row justify-between items-center ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100' : 'bg-white'}`}>
        <Text className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text className="text-gray-600">▼</Text>
      </TouchableOpacity>
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}

      <Modal visible={isOpen} transparent animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          activeOpacity={1}
          onPress={() => setIsOpen(false)}>
          <View className="bg-white rounded-xl w-4/5 max-h-96">
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-bold text-gray-900">
                {label || 'Select an option'}
              </Text>
            </View>
            <FlatList
              data={options}
              keyExtractor={item => item.value.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  className={`p-4 border-b border-gray-100 ${
                    item.value === value ? 'bg-blue-50' : ''
                  }`}
                  onPress={() => {
                    onChange(item.value);
                    setIsOpen(false);
                  }}>
                  <Text
                    className={`text-base ${
                      item.value === value ? 'text-blue-600 font-semibold' : 'text-gray-900'
                    }`}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Select;
