import React from 'react';
import { Layout, Button, Text } from '@ui-kitten/components';
import { styled } from 'nativewind';

interface FilterButtonsProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const StyledLayout = styled(Layout);
const StyledButton = styled(Button);

const FilterButtons: React.FC<FilterButtonsProps> = ({ selectedFilter, onFilterChange }) => {
  const filters = ['ALL', 'Food', 'Mobility', 'Electricity'];

  return (
      <StyledLayout className="mt-5 flex-row flex-nowrap justify-center">
        {filters.map((category) => (
          <StyledButton
            key={category}
            onPress={() => onFilterChange(category)}
            className={`p-1 m-1 rounded-full`} 
            appearance={selectedFilter === category ? 'filled' : 'outline'}
            status={selectedFilter === category ? 'success' : 'basic'}
          >
            <Text category='label'>{category}</Text>
          </StyledButton>
        ))}
      </StyledLayout>
  );
};

export default FilterButtons;
