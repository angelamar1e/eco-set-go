import React from 'react';
import { Layout, Text, useTheme, Button } from '@ui-kitten/components';
import { styled } from 'nativewind';
import Achievements from './achievements';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import Search from './search';
import { myTheme } from '@/constants/custom-theme';

const StyledLayout = styled(Layout);
const StyledText = styled(Text);
const StyledButton = styled(Button);

const Milestones = () => {
  const theme = useTheme();
  const maintextcolor = theme['color-primary-700'];
  const navigation = useNavigation();

  const BackButton = () => {
    return (
      <StyledButton 
        onPress={() => navigation.goBack()} 
        className="p-1 bottom-20 ml-6 rounded-full absolute"
          size="large"
          appearance="filled"
          status="primary">
        <Ionicons name="arrow-back"/>
      </StyledButton>
    );
  };

  return (
    <StyledLayout className="flex-1">
      <StyledLayout className='h-1/6 rounded-b-3xl justify-center items-center relative'
       style={{
        backgroundColor: myTheme['color-success-700']
        }}
      >
        <StyledText className="text-white text-3xl" style={{ fontFamily: 'Poppins-SemiBold'}}>Milestones</StyledText>
      </StyledLayout>   
      
      <StyledLayout className="ml-2 mr-2 p-1 mb-5">
        <Search onSearch={(query: string) => console.log('Searching for:', query)} />
      </StyledLayout>
      <Achievements />
      <BackButton />
    </StyledLayout>
  );
};

export default Milestones;
