import React, { FC, useState } from 'react';
import { View, Text, Pressable } from 'react-native';

interface StepperProps {
  title: string;
  value: number;
  onChange: (value: number) => void;
}

const Stepper: FC<StepperProps> = ({ title, value, onChange }) => {
  const increment = () => {
    onChange(value + 1);
  };

  const decrement = () => {
    if (value > 0) {
      onChange(value - 1);
    }
  };

  return (
    <View className="flex-row items-center justify-between bg-white p-4 rounded-lg border border-lime-800">
      <Text className="text-[18px] mr-3">{title}</Text>
      <View className="flex-row items-center">
      <Pressable 
          onPress={decrement} 
          className="bg-lime-800 p-2 rounded-full"
        >
          <Text className="text-lg text-white font-bold">-</Text>
        </Pressable>
        <Text className="mx-3 text-lg">{value}</Text>
        <Pressable 
          onPress={increment} 
          className="bg-lime-800 p-2 rounded-full"
        >
          <Text className="text-lg text-white font-bold">+</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Stepper;
