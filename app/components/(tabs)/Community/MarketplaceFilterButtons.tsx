import React from 'react';
import { Text, Layout, Button } from '@ui-kitten/components';
import { styled } from 'nativewind';

interface FilterButtonsProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const StyledLayout = styled(Layout);
const StyledButton = styled(Button);
const StyledText = styled(Text); 

const FilterButtons: React.FC<FilterButtonsProps> = ({ selectedFilter, onFilterChange }) => {
  const filters = ['ALL', 'Crops', 'Clothes', 'Others'];

  return (
    <StyledLayout className="mt-2 mb-2 flex-row flex-nowrap justify-center">
      {filters.map((category) => (
        <StyledButton
          key={category}
          onPress={() => onFilterChange(category)}
          className={`p-1 m-1 rounded-full`} 
          appearance={selectedFilter === category ? 'filled' : 'outline'}
          status={selectedFilter === category ? 'success' : 'basic'}
        >
          <StyledText 
            category='label' 
            style={{ color: selectedFilter === category ? '#FFFFFF' : '#000000' }}
          >
            {category}
          </StyledText>
        </StyledButton>
      ))}
    </StyledLayout>
  );
};

export default FilterButtons;
