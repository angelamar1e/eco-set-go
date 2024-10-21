import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface FilterButtonsProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ selectedFilter, onFilterChange }) => {
  const filters = ['ALL', 'Food', 'Mobility', 'Electricity'];

  return (
    <View className="bg-white mt-4 justify-between">
      <View className="flex-row flex-wrap justify-center">
        {filters.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => onFilterChange(category)}
            className={`m-1 px-4 py-2 rounded-full ${selectedFilter === category ? 'bg-green-500' : 'bg-gray-200'}`}
          >
            <Text className={`${selectedFilter === category ? 'text-white' : 'text-black'}`}>   
            {category}  
            </Text>
            
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default FilterButtons;
