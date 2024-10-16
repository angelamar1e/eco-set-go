import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface FilterButtonsProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ selectedFilter, onFilterChange }) => {
  const filters = ['ALL', 'Crops', 'Clothes', 'Others'];

  return (
    <View className="bg-white p-2 flex-row justify-around mb-2 ">
      {filters.map((category) => (
        <TouchableOpacity
          key={category}
          onPress={() => onFilterChange(category)}
          className={`px-4 py-2 rounded-full ${selectedFilter === category ? 'bg-green-500' : 'bg-gray-200'}`}
        >
          <ThemedText type='default' className={`${selectedFilter === category ? 'text-white' : 'text-black'}`}>
            {category}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default FilterButtons;
