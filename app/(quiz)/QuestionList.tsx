import React from 'react';
import { View, Text, FlatList, ListRenderItem } from 'react-native';

type QuestionItem = {
  id: string;
  question: string;
};

const QuestionList = () => {
  const dummyQuestions: QuestionItem[] = [
    { id: '1', question: 'How far do you travel per year by car?' },
    { id: '2', question: 'How much energy do you consume daily?' },
    { id: '3', question: 'What’s your average water usage per day?' },
    { id: '4', question: 'How often do you use public transportation?' },
  ];
  
    // Log data to check if it's properly received
    console.log('dummyQuestions:', dummyQuestions);
    
    const renderItem: ListRenderItem<QuestionItem> = ({ item }) => (
      <View className="border border-gray-300 p-3 rounded-md mb-2">
        <Text className="text-lg text-black">{item.question}</Text>
      </View>
    );
  
  return (
    <View className="flex-1 p-4 bg-white">
      {dummyQuestions.length === 0 ? (
        <Text>No questions available</Text>
      ) : (
        <FlatList
          data={dummyQuestions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default QuestionList;
