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
      <StyledInput
        placeholder="Search"
        className="flex-1 rounded-full"
        onChangeText={onSearch}
        style={{
          fontFamily: 'Poppins-Regular',
        }}
        textStyle={{
          fontFamily: 'Poppins-Regular',
          fontSize: 13,
          top: 2
        }}
        accessoryLeft={() => (
          <Ionicons name='search-outline' size={20} color="#1BD67C" />
        )}
      />
    </StyledLayout>
  );
};

export default SearchBar;
