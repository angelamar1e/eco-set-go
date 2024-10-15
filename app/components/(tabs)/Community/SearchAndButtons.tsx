import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface SearchAndButtonsProps {
  onSearch: (text: string) => void;
  selectedButton: string | null;  
  setSelectedButton: (buttonName: string | null) => void; 
}

const SearchAndButtons: React.FC<SearchAndButtonsProps> = ({ onSearch, selectedButton, setSelectedButton }) => {
  const handleButtonPress = (buttonName: string) => {
    setSelectedButton(selectedButton === buttonName ? null : buttonName);
  };

  return (
    <View className="absolute -bottom-8 left-4 right-4 bg-white p-2 rounded-full shadow flex-row items-center">
      <View className="flex-1 flex-row bg-gray-100 p-2 rounded-full items-center mr-2">
        <Ionicons name="search" size={20} color="#A9A9A9" className="mr-2" />
        <TextInput
          placeholder="Search"
          className="flex-1 text-base ml-2"
          onChangeText={onSearch}
        />
      </View>

      <TouchableOpacity
        className={`p-2 rounded-full shadow mr-2 ${selectedButton === 'list' ? 'bg-green-500' : 'bg-white'}`}
        onPress={() => handleButtonPress('list')}
      >
        <Ionicons name="list" size={24} color={selectedButton === 'list' ? "#FFFFFF" : "#A9A9A9"} />
      </TouchableOpacity>

      <TouchableOpacity
        className={`p-2 rounded-full shadow mr-2 ${selectedButton === 'chat' ? 'bg-green-500' : 'bg-white'}`}
        onPress={() => handleButtonPress('chat')}
      >
        <Ionicons name="chatbubble-outline" size={24} color={selectedButton === 'chat' ? "#FFFFFF" : "#A9A9A9"} />
      </TouchableOpacity>

      <TouchableOpacity
        className={`p-2 rounded-full shadow ${selectedButton === 'cart' ? 'bg-green-500' : 'bg-white'}`}
        onPress={() => handleButtonPress('cart')}
      >
        <Ionicons name="cart-outline" size={24} color={selectedButton === 'cart' ? "#FFFFFF" : "#A9A9A9"} />
      </TouchableOpacity>
    </View>
  );
};

export default SearchAndButtons;
