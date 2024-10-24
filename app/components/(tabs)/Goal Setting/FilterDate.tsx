import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { styled } from 'nativewind';
import { Text } from '@ui-kitten/components';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import { myTheme } from '@/constants/custom-theme';

const StyledView = styled(View);
const StyledText = styled(Text);

// Define the props interface
interface FilterDateProps {
  onToggle: (isClicked: boolean) => void; 
}

const FilterDate: React.FC<FilterDateProps> = ({ onToggle }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handlePress = () => {
    const newState = !isClicked;
    setIsClicked(newState);
    onToggle(newState); 
  };

  return (
    <TouchableOpacity onPress={handlePress} className="flex-row items-center">
      <Ionicons name="calendar" size={18} color="#8F9BB3" />
      <StyledView className="border rounded-full p-1 m-1 flex-row items-center" 
      style={{
        borderColor: myTheme['color-basic-600'], 
        backgroundColor: myTheme['color-basic-transparent-100']
        }}
      >
        <StyledText category="label" className="ml-1 mr-2 text-sm" 
          style={{
            color: myTheme['color-basic-600']
            }}
          >Filter date
        </StyledText>
        {isClicked ? (
          <Ionicons name="chevron-up" size={13} color="#8F9BB3" />
        ) : (
          <Ionicons name="chevron-down" size={13} color="#8F9BB3"  />
        )}
      </StyledView>
    </TouchableOpacity>
  );
};

export default FilterDate;
