import React from 'react';
import { View, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface SearchBarProps {
  onSearch: (query: string) => void;
  children?: React.ReactNode;
}


const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  return (
    <View className="absolute -bottom-4 left-4 right-4 bg-white p-2 rounded-full shadow flex-row items-center">
      <View className="flex-1 flex-row bg-gray-100 p-2 rounded-full items-center mr-2">
        <Ionicons name="search" size={20} color="#A9A9A9" className="mr-2" />
        <TextInput
          placeholder="Search"
          className="flex-1 text-base ml-2"
          onChangeText={onSearch}
        />
      </View>
    </View>
  );
};

export default SearchBar;