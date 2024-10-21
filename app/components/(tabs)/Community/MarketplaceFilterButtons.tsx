import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface FilterButtonsProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ selectedFilter, onFilterChange }) => {
  const filters = ['ALL', 'Crops', 'Clothes', 'Others'];

  return (
    <View className="p-2 flex-row justify-around">
      {filters.map((category) => (
        <TouchableOpacity
          key={category}
          onPress={() => onFilterChange(category)}
          className={`px-4 py-2 rounded-full ${selectedFilter === category ? 'bg-green-500' : 'bg-gray-200'}`}
        >
          <Text className={`${selectedFilter === category ? 'text-white' : 'text-black'}`}>
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default FilterButtons;
