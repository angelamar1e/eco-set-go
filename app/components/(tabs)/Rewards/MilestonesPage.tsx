import React from 'react';
import { Layout, Text, Card, ProgressBar, useTheme, Button } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { View } from 'react-native';
import Achievements from './achievements';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

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
        style={{ position: 'absolute', left: 20, top: 600, borderWidth: 0}} 
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
      
      <View className="items-center -mt-20 -bottom-5 mb-3 z-50">
        <StyledCard style={{ borderRadius: 100, padding: 4, width: '90%', elevation: 2 }}>
          <StyledText category="h1" className='text-center' style={{ color: maintextcolor }}>Level 10</StyledText>
          
          <StyledLayout className="mt-1">
            <ProgressBar
              progress={0.1}
              style={{
                height: 10,
                borderRadius: 5,
                backgroundColor: "#e0e0e0",
                marginTop: 5,
                width: "100%",
              }}
            />
          </StyledLayout>

          <StyledLayout className="flex-row justify-between items-center mt-2 ">
            <StyledText category="s1">100</StyledText>
            <StyledText category="c1" className="right-11">current EcoPoints</StyledText>
            <StyledText category="c1" className="left-11">Level 11</StyledText>
            <StyledText category="s1">1000</StyledText>          
          </StyledLayout>
        </StyledCard>
        <Achievements />
        <BackButton />
      </View>
    </StyledLayout>
  );
};

export default Milestones;
