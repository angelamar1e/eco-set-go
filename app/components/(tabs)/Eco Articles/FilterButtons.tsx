import React from 'react';
import { ScrollView } from 'react-native';
import { Layout, Button, Text } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { useLoadFonts } from '@/assets/fonts/loadFonts';

interface FilterButtonsProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const StyledLayout = styled(Layout);
const StyledButton = styled(Button);

const FilterButtons: React.FC<FilterButtonsProps> = ({ selectedFilter, onFilterChange }) => {
  const filters = ['ALL', 'Getting Started', 'Food', 'Transportation', 'Electricity', 'QC Initiatives'];
  const fontsLoaded = useLoadFonts();

  return (
    <StyledLayout className="mt-2 justify-center items-center flex-row flex-wrap">
        {filters.map((category) => (
          <StyledButton
            key={category}
            onPress={() => onFilterChange(category)}
            className={`p-1 m-1 rounded-full flex-grow`} 
            appearance={selectedFilter === category ? 'filled' : 'outline'}
            status={selectedFilter === category ? 'success' : 'basic'}
            size='small'
          >
            <Text category='label'>{category}</Text>
          </StyledButton>
        ))}
    </StyledLayout>
  );
};

export default FilterButtons;
