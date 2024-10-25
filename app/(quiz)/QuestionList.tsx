import React from 'react';
import { FlatList, ListRenderItem, TouchableOpacity } from 'react-native';
import { Layout, Card, Text } from '@ui-kitten/components';
import { myTheme } from "@/constants/custom-theme"; 
import { styled } from 'nativewind';
import { useNavigation } from 'expo-router';

type QuestionItem = {
  id: string;
  question: string;
  answer?: string;
};

const StyledText = styled(Text);
const StyledCard = styled(Card);

const QuestionList = () => {
  const navigation = useNavigation();

  const dummyQuestions: QuestionItem[] = [
    { id: '1', question: 'How far do you travel per year by car?' },
    { id: '2', question: 'How much energy do you consume daily?', answer: 'I consume around 30 kWh daily.' },
    { id: '3', question: 'What’s your average water usage per day?'},
    { id: '4', question: 'How often do you use public transportation?'},
  ];

  const handlePress = (id: string) => {
    console.log(`Question ${id} pressed`);
  };

  const renderItem: ListRenderItem<QuestionItem> = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item.id)}>
      <StyledCard 
        style={{ 
          marginBottom: 10, 
          borderRadius: 15, 
          elevation: 2, 
          borderWidth: 1, 
          borderColor: myTheme['color-primary-500'], 
          backgroundColor: myTheme['color-primary-100'], 
        }}>

        <StyledText category='h6' style={{ color: myTheme['color-primary-900'] }}>
          {item.question}
        </StyledText>

      {item.answer && (
        <StyledCard 
          style={{ 
            backgroundColor: 'white',
            padding: 1, 
            marginTop: 10,
            borderRadius: 15,
            borderWidth: 1, 
            borderColor: myTheme['color-primary-400'],
            alignSelf: 'flex-start',
            maxWidth: '100%'  
          }}>

          <StyledText category='s1' style={{ color: myTheme['color-primary-900'] }}>
            {item.answer}
          </StyledText>
        </StyledCard>
      )}
      </StyledCard>
    </TouchableOpacity>
  );

  return (
    <Layout style={{ flex: 1, padding: 16 }}>
      {dummyQuestions.length === 0 ? (
        <StyledText category='s1' style={{ textAlign: 'center', marginTop: 20 }}>
          No questions available
        </StyledText>
      ) : (
        <FlatList
          data={dummyQuestions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Layout>
  );
};

export default QuestionList;
