import React from 'react';
import {View, Text} from 'react-native';

const Stepper = ({
  steps = [],
  currentStep = 0,
  orientation = 'horizontal',
  style,
}) => {
  if (orientation === 'vertical') {
    return (
      <View className="py-4" style={style}>
        {steps.map((step, index) => (
          <View key={index} className="flex-row mb-6">
            <View className="items-center mr-4">
              <View
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`}>
                <Text
                  className={`font-bold ${
                    index <= currentStep ? 'text-white' : 'text-gray-600'
                  }`}>
                  {index + 1}
                </Text>
              </View>
              {index < steps.length - 1 && (
                <View
                  className={`w-0.5 h-12 mt-2 ${
                    index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              )}
            </View>
            <View className="flex-1 pt-1">
              <Text
                className={`font-semibold text-base ${
                  index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                }`}>
                {step.label}
              </Text>
              {step.description && (
                <Text className="text-gray-600 text-sm mt-1">{step.description}</Text>
              )}
            </View>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View className="flex-row items-center justify-between py-4" style={style}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <View className="items-center">
            <View
              className={`w-10 h-10 rounded-full items-center justify-center ${
                index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
              }`}>
              <Text
                className={`font-bold ${
                  index <= currentStep ? 'text-white' : 'text-gray-600'
                }`}>
                {index + 1}
              </Text>
            </View>
            <Text
              className={`text-xs mt-2 ${
                index <= currentStep ? 'text-gray-900' : 'text-gray-500'
              }`}>
              {step.label}
            </Text>
          </View>
          {index < steps.length - 1 && (
            <View
              className={`flex-1 h-0.5 mx-2 ${
                index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

export default Stepper;
