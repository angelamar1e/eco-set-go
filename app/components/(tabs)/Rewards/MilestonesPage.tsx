import React from 'react';
import { Layout, Text, Card, ProgressBar, useTheme, Button } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { View } from 'react-native';
import Achievements from './achievements';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import Search from './search';

const StyledLayout = styled(Layout);
const StyledText = styled(Text);
const StyledCard = styled(Card);
const StyledButton = styled(Button);

const Milestones = () => {
  const theme = useTheme();
  const maintextcolor = theme['color-primary-700'];
  const navigation = useNavigation();

  const BackButton = () => {
    return (
      <StyledButton 
        onPress={() => navigation.goBack()} 
        style={{ position: 'absolute', left: 20, top: 750, borderWidth: 0}} 
        className="rounded-full bg-lime-800"
        size='large'
      >
        <Ionicons name="arrow-back"/>
      </StyledButton>
    );
  };

  return (
    <StyledLayout className="flex-1">

      <StyledLayout className='bg-lime-800 h-1/4 rounded-b-3xl justify-center items-center relative'>
        <StyledText category="h4">Milestones</StyledText>
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
