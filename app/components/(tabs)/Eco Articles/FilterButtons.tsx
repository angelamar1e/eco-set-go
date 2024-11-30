import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { useLoadFonts } from '@/assets/fonts/loadFonts';
import { myTheme } from '@/constants/custom-theme';

interface FilterButtonsProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const StyledLayout = styled(Layout);
const StyledText = styled(Text);

const FilterButtons: React.FC<FilterButtonsProps> = ({ selectedFilter, onFilterChange }) => {
  const filters = ['ALL', 'Getting Started', 'Food', 'Transportation', 'Electricity', 'QC Initiatives'];
  const fontsLoaded = useLoadFonts();

  return (
    <StyledLayout className="mt-2 flex-row flex-wrap">
        {filters.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => onFilterChange(category)}
            className={`p-1 px-3 py-1 m-1 rounded-full border ${
              selectedFilter === category 
                ? 'bg-[#34C759] border-[#34C759]' 
                : 'bg-[#F5F7F9] border-[#8F9BB3]'
            }`}
          >
            <StyledText 
              style={{ 
                fontFamily: 'Poppins-Medium',
                fontSize: 12,
                color: selectedFilter === category ? 'white' : '#8F9BB3',
                top: 2,
              }}
            >
              {category}
            </StyledText>
          </TouchableOpacity>
        ))}
    </StyledLayout>
  );
};

export default FilterButtons;
