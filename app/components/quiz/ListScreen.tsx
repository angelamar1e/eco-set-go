import React from 'react';
import { SafeAreaView } from 'react-native';
import { useNavigation } from 'expo-router';
import QuestionList from '../../(quiz)/QuestionList';
import { Ionicons } from '@expo/vector-icons';
import { Layout, Text, TopNavigation, TopNavigationAction, useTheme } from '@ui-kitten/components';
import { myTheme } from "@/constants/custom-theme";
import { styled } from 'nativewind';
import { View } from 'react-native';

const StyledText = styled(Text);

const ListHeader = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  const navigateBack = () => navigation.goBack();
  const BackIcon = () => <Ionicons name="chevron-back" size={25} color={theme['color-success-900']} />;

  return (
    <Layout level='1' style={{ borderBottomWidth: 2, borderBottomColor: myTheme["color-success-900"], borderStyle: 'solid' }}>
      <TopNavigation
        accessoryLeft={() => (
          <View className='flex-row items-center'>
            <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
            <StyledText 
              style={{ color: myTheme["color-success-700"], fontFamily: 'Poppins-Bold', fontSize: 30, top: 5 }}   
            >
            All Questions
          </StyledText>
          </View> 
        )}
      />
    </Layout>
  );
};

const QuestionListScreen = () => {
  return (
    <SafeAreaView className="flex-1 pt-10">
      <ListHeader />
      <QuestionList />
    </SafeAreaView>
  );
};

export default QuestionListScreen;
