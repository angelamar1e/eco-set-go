import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { styled } from 'nativewind';
import { Text } from '@ui-kitten/components';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import { myTheme } from '@/constants/custom-theme';

const StyledButton = styled(TouchableOpacity);
const StyledView = styled(View);
const StyledText = styled(Text);

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
    <StyledButton
      onPress={handlePress}
      className="flex-row items-center border rounded-full p-1 px-3 py-1 m-1"
      style={{
        borderColor: myTheme['color-basic-600'], 
        backgroundColor: myTheme['color-basic-transparent-100']
      }}
    >
      <Ionicons name="calendar" size={18} color="#8F9BB3" />
      <Text category="label"
        style={{
          color: myTheme['color-basic-600'],
          marginLeft: 5,
          marginRight: 5
        }}
      >
        Filter date
      </Text>
        {isClicked ? (
          <Ionicons name="chevron-up" size={13} color="#8F9BB3" />
        ) : (
          <Ionicons name="chevron-down" size={13} color="#8F9BB3" />
        )}
    </StyledButton>
  );
};

export default FilterDate;
