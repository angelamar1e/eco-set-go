import { ThemedText } from '@/components/ThemedText';
import React, { FC } from 'react';
import { View, Text, Pressable } from 'react-native';

interface StepperProps {
  title: string;
  frequency: number; 
  onChange: (value: number) => void; 
}

const Stepper: FC<StepperProps> = ({ title, frequency: value, onChange }) => {
  // Increment the frequency
  const increment = () => {
    onChange(value + 1);  // Pass updated number
  };

  // Decrement the frequency (with lower bound at 0)
  const decrement = () => {
    if (value > 0) {
      onChange(value - 1);  // Pass updated number
    }
  };

  return (
    <View className="flex-row items-center justify-between bg-white p-4 rounded-[10px] border border-gray-300">
      <View>
        <ThemedText type='defaultSemiBold' className="text-[20px] text-black mr-3">{title}</ThemedText>
        <Text className="text-[15px] text-gray-500 mt-1">{value}x</Text>
      </View>

      <View className="flex-row items-center">
        <Pressable 
            onPress={decrement} 
            className="bg-lime-800 p-1 w-[35px] rounded-l-lg border-r border-white"
          >
            <Text className="text-lg text-white ml-3">-</Text>
        </Pressable>

        <Pressable 
            onPress={increment} 
            className="bg-lime-800 p-1 w-[35px] mr-1 rounded-r-lg border-l border-white"
          >
            <Text className="text-lg text-white ml-2">+</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Stepper;