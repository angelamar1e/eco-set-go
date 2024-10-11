import React, { useContext, useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ScrollView } from "react-native-gesture-handler";
import { View } from "react-native";
import { PresetChoices } from "../components/quiz/PresetChoices";
import { QuestionContainer } from "../components/quiz/QuestionContainer";
import { Text, TextInput } from "react-native-paper";
import Calculator from "../components/quiz/Calculator";
import { Link } from "expo-router";
import { QuizContext } from '@/contexts/QuizContext';
import firestore from '@react-native-firebase/firestore';

const Question1 = () => {
  const { questionDocumentIds, questionCollection } = useContext(QuizContext);
  const [choices, setChoices] = useState(null);
  const [question, setQuestion] = useState<string>("");

    // Fetch question document 
    useEffect(() => {
      const fetchQuestion = async () => {
        try {
          console.log(questionDocumentIds);
          const snapshot = await questionCollection.doc(questionDocumentIds[0]).get();

          if (snapshot.exists) {
            const questionData = snapshot.data();
            setQuestion(questionData.question);
            setChoices(questionData.choices);
          }
          else {
            console.log("no document");
          }
        } catch (error) {
          console.error('Error fetching document:', error);
        }
      };
  
      fetchQuestion();
    }, [questionDocumentIds]); // Fetch only once when the component mounts

  return (
    <ThemedView className="flex-1">
      <ScrollView>
        {/* <Calculator value={numericValue * 0.21} /> */}
        <QuestionContainer>
          <Text>{question}</Text>
        </QuestionContainer>

        <View className="flex-row flex-wrap justify-between mb-3">
          {choices ? Object.entries(choices).map(([key, value]) => (
            <Text key={key}>{key}</Text>
          )) : <Text> Loading... </Text>}
        </View>
      </ScrollView>
    </ThemedView>
  );
};

export default Question1;