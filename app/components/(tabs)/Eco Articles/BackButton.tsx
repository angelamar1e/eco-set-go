import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@ui-kitten/components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text } from '@ui-kitten/components';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

const BackButton = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  const navigateBack = () => {
    navigation.goBack();
  };

  return (
    <StyledView className="flex-row items-center mt-5">
      <TouchableOpacity onPress={navigateBack} className="mr-2">
        <Ionicons name="chevron-back" size={35} color={theme['color-primary-900']} />
      </TouchableOpacity>
    </StyledView>
  );
};

export default BackButton;
