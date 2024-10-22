import React from 'react';
import { Layout, Button } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { ThemedText } from '@/components/ThemedText';

interface FilterButtonsProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const StyledLayout = styled(Layout);
const StyledButton = styled(Button);

const FilterButtons: React.FC<FilterButtonsProps> = ({ selectedFilter, onFilterChange }) => {
  const filters = ['ALL', 'Food', 'Mobility', 'Electricity'];

  return (
    <StyledLayout className="bg-white mt-4">
      <StyledLayout className="flex-row flex-nowrap justify-center">
        {filters.map((category) => (
          <StyledButton
            key={category}
            onPress={() => onFilterChange(category)}
            className={`m-1 rounded-full ${
              selectedFilter === category ? 'bg-green-500' : 'bg-gray-200'
            } p-1`} 
            appearance={selectedFilter === category ? 'filled' : 'outline'}
            status={selectedFilter === category ? 'success' : 'basic'}
          >
            <ThemedText className={`text-sm ${selectedFilter === category ? 'text-white' : 'text-black'}`}>
              {category}
            </ThemedText>
          </StyledButton>
        ))}
      </StyledLayout>
    </StyledLayout>
  );
};

export default FilterButtons;
