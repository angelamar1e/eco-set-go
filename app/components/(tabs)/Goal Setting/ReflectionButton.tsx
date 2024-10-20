import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Entypo, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText'; 

const ReflectionButton = () => {
  const [expanded, setExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false); 
  const iconColor = isFocused ? '#34C759' : '#A9A9A9';

  return (
    <View className='flex-row ml-6'>
      <MaterialCommunityIcons name="calendar" size={20} color={iconColor} style={{marginTop: 5, marginRight:2}} />

      <TouchableOpacity
        className='flex-row items-center justify-between rounded-full w-[28%] px-2 py-1 mb-3  bg-gray-100'
        onPress={() => setExpanded(!expanded)} 
      >

        <ThemedText className='text-black text-[14px] ml-1 '>Filter by date</ThemedText>

        <Entypo
          name={expanded ? "chevron-up" : "chevron-down"}
          size={14}
          color="#d6d3d1"
        />
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => setIsFocused(!isFocused)} 
        onFocus={() => setIsFocused(true)}      
        onBlur={() => setIsFocused(false)}      
        className='w-8 h-8 p-1 left-[195px]'
      >
        <Ionicons name='pencil' size={20} color={iconColor}/>
      </TouchableOpacity>
    </View>
  );
};

export default ReflectionButton;
