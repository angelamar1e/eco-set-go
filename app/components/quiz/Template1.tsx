import React from 'react';
import { View, Button } from 'react-native';
import { router } from "expo-router";

const QuizScreen = () => {

  const goToSampleQuestion = () => {
    router.push("/(quiz)/SampleQuestion");
  };

  return (
    <View className="flex-1 items-center justify-center bg-stone-100 p-4">
      <Button title="Sample Question" onPress={goToSampleQuestion} />
    </View>
  );
};

export default QuizScreen;
