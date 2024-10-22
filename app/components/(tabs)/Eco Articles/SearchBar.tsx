import React from 'react';
import { Input, Layout } from '@ui-kitten/components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styled } from 'nativewind';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const StyledLayout = styled(Layout);
const StyledInput = styled(Input);

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  return (
    <StyledLayout className="absolute -bottom-4 left-4 right-4 p-1 rounded-full shadow">
      <StyledLayout className="flex-row p-2 rounded-full items-center flex-1">
        <Ionicons name='search-outline' size={25} color="#1BD67C"/>
        <StyledInput
          placeholder="Search"
          className="ml-2 flex-1 rounded-full"
          onChangeText={onSearch}
        />
      </StyledLayout>
    </StyledLayout>
  );
};

export default SearchBar;
