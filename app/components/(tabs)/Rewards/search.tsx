import React from 'react';
import { Input, Layout } from '@ui-kitten/components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styled } from 'nativewind';

interface SearchProps {
  onSearch: (query: string) => void;
}

const StyledLayout = styled(Layout);
const StyledInput = styled(Input);

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  return (
    <StyledLayout className="absolute -bottom-5 left-4 right-4 p-2 rounded-full shadow z-50">
      <StyledInput
        placeholder="Search"
        className="flex-1 rounded-full"
        onChangeText={onSearch}
        accessoryLeft={() => (
          <Ionicons name='search-outline' size={20} color="#1BD67C" />
        )}
      />
    </StyledLayout>
  );
};

export default Search;
