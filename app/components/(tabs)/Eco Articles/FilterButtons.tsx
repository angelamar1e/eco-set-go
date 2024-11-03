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
  const filters = ['ALL', 'Getting Started', 'Food', 'Transportation', 'Electricity'];
  const fontsLoaded = useLoadFonts();

  return (
    <StyledLayout className="mt-2">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
        {filters.map((category) => (
          <StyledButton
            key={category}
            onPress={() => onFilterChange(category)}
            className={`p-1 m-1 rounded-full`} 
            appearance={selectedFilter === category ? 'filled' : 'outline'}
            status={selectedFilter === category ? 'success' : 'basic'}
            size='small'
          >
            <Text category='label'>{category}</Text>
          </StyledButton>
        ))}
      </ScrollView>
    </StyledLayout>
  );
};

export default FilterButtons;
