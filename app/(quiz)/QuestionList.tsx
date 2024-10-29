import React, { useEffect, useState } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { Layout, Button, Text } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { router } from 'expo-router';
import firestore from '@react-native-firebase/firestore';
import { myTheme } from '@/constants/custom-theme';
import { QuestionData } from "@/types/QuestionData";

type QuestionItem = {
  id: string;
  question: string;
};

const StyledText = styled(Text);
const StyledLayout = styled(Layout);
const StyledButton = styled(Button);

const QuestionList = () => {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [questionDocumentIds, setQuestionDocumentIds] = useState<string[]>([]); // State for question document IDs

  // Fetch and sort questions and their document IDs directly within this component
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const snapshot = await firestore().collection('quiz').get();
        const loadedQuestions: QuestionItem[] = snapshot.docs
          .map(doc => {
            const data = doc.data() as QuestionData;
            return { id: doc.id, question: data.question };
          })
          .sort((a, b) => parseInt(a.id) - parseInt(b.id));

        setQuestions(loadedQuestions);

        // Extracting document IDs and sorting them
        const ids = snapshot.docs.map(doc => doc.id);
        const sortedIds = ids
          .map(id => parseInt(id, 10))
          .sort((a, b) => a - b)
          .map(id => id.toString());

        setQuestionDocumentIds(sortedIds);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const renderItem: ListRenderItem<QuestionItem> = ({ item }) => (
    <StyledButton  
      onPress={() => router.push(`/quiz/${item.id}`)} // Navigate to the specific question page
      style={{ 
        marginBottom: 10, 
        borderRadius: 15, 
        elevation: 2, 
        borderWidth: 1, 
        borderColor: myTheme['color-primary-500'], 
        backgroundColor: myTheme['color-primary-900'],
        justifyContent: 'flex-start'
      }}
    >
      <StyledText 
        category='h6' 
        style={{ color: myTheme['color-primary-900'], textAlign: 'left', fontWeight: 'bold' }}>
        {item.question}
      </StyledText>
    </StyledButton>
  );

  // Log questionDocumentIds to check if it's being accessed correctly
  console.log('Question Document IDs:', questionDocumentIds); 

  return (
    <StyledLayout className="flex-1 p-4">
      <FlatList
        data={questions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </StyledLayout>
  );
};

export default QuestionList;
