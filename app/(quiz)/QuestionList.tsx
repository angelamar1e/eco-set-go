import React, { useEffect, useState } from 'react';
import { FlatList, ListRenderItem, TouchableOpacity } from 'react-native';
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

  const renderItem: ListRenderItem<QuestionItem> = ({ item, index }) => (
    <TouchableOpacity  
      onPress={() => router.push(`/(quiz)/?params=${index}`)} // Navigate to the specific question page
      style={{ 
        marginBottom: 10, 
        borderRadius: 15, 
        borderWidth: 1, 
        borderColor: myTheme['color-success-900'], 
        backgroundColor: myTheme['color-success-700'],
        justifyContent: 'flex-start',
        padding: 10, 
      }}
    >
      <StyledText 
        style={{ color: 'white', textAlign: 'left', fontFamily: 'Poppins-Regular', fontSize: 14, top: 2 }}>
        {item.question}
      </StyledText>
    </TouchableOpacity>
  );

  // Log questionDocumentIds to check if it's being accessed correctly
  console.log('Question Document IDs:', questionDocumentIds); 

  return (
    <StyledLayout className="flex-1 px-4 pt-1">
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