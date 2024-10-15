// src/app/components/(tabs)/Community/SearchAndButtons.js
import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface SearchAndButtonsProps {
  onSearch: (text: string) => void;
  isListVisible: boolean;
  setIsListVisible: (visible: boolean) => void;
}

const SearchAndButtons: React.FC<SearchAndButtonsProps> = ({ onSearch, isListVisible, setIsListVisible }) => {
  return (
    <View className="absolute -bottom-8 left-4 right-4 bg-white p-2 rounded-full shadow flex-row items-center">
      <View className="flex-1 flex-row bg-gray-100 p-2 rounded-full items-center mr-2">
        <Ionicons name="search" size={20} color="#A9A9A9" className="mr-2" />
        <TextInput
          placeholder="Search"
          className="flex-1 text-base"
          onChangeText={onSearch}
        />
      </View>

      <TouchableOpacity
        className={`p-2 rounded-full shadow mr-2 ${isListVisible ? 'bg-green-500' : 'bg-white'}`}
        onPress={() => setIsListVisible(true)} 
      >
        <Ionicons name="list" size={24} color={isListVisible ? "#FFFFFF" : "#A9A9A9"} />
      </TouchableOpacity>
      <TouchableOpacity className="p-2 bg-white rounded-full shadow mr-2">
        <Ionicons name="chatbubble-outline" size={24} color="#34C759" />
      </TouchableOpacity>
      <TouchableOpacity className="p-2 bg-white rounded-full shadow">
        <Ionicons name="cart-outline" size={24} color="#34C759" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchAndButtons;
