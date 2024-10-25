import React from 'react';
import { Layout, Input, Button } from '@ui-kitten/components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styled } from 'nativewind';

interface SearchAndButtonsProps {
  onSearch: (text: string) => void;
  selectedButton: string | null;  
  setSelectedButton: (buttonName: string | null) => void; 
}

const StyledLayout = styled(Layout);
const StyledInput = styled(Input);
const StyledButton = styled(Button);

const SearchAndButtons: React.FC<SearchAndButtonsProps> = ({ onSearch, selectedButton, setSelectedButton }) => {
  const handleButtonPress = (buttonName: string) => {
    setSelectedButton(selectedButton === buttonName ? null : buttonName);
  };

  return (
    <StyledLayout className="absolute -bottom-8 left-4 right-4 p-2 rounded-full shadow flex-row items-center">
      <StyledInput
        placeholder="Search"
        className="flex-1 rounded-full"
        onChangeText={onSearch}
        accessoryLeft={() => (
          <Ionicons name="search-outline" size={20} color="#1BD67C" />
        )}
      />
      
      <StyledButton
        className='rounded-full p-1 mx-1' 
        appearance={selectedButton === 'list' ? 'filled' : 'outline'}
        status={selectedButton === 'list' ? 'success' : 'basic'} 
        onPress={() => handleButtonPress('list')}
      >
        <Ionicons name="list" size={24} color={selectedButton === 'list' ? "#FFFFFF" : "#A9A9A9"} />
      </StyledButton>

      <StyledButton
        className='rounded-full p-1 mx-1' 
        appearance={selectedButton === 'chat' ? 'filled' : 'outline'}
        status={selectedButton === 'chat' ? 'success' : 'basic'} 
        onPress={() => handleButtonPress('chat')}
      >           
        <Ionicons name="chatbubble-outline" size={24} color={selectedButton === 'chat' ? "#FFFFFF" : "#A9A9A9"} />
      </StyledButton>

      <StyledButton
        className='rounded-full p-1 mx-1' 
        appearance={selectedButton === 'cart' ? 'filled' : 'outline'}
        status={selectedButton === 'cart' ? 'success' : 'basic'} 
        onPress={() => handleButtonPress('cart')}
      >
        <Ionicons name="cart-outline" size={24} color={selectedButton === 'cart' ? "#FFFFFF" : "#A9A9A9"} />
      </StyledButton>
    </StyledLayout>
  );
};

export default SearchAndButtons;
