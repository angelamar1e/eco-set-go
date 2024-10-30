import React, { useState, useEffect, useContext } from "react";
import { View } from "react-native";
import { QuizContext } from "@/contexts/QuizContext";
import { EmissionsContext } from "@/contexts/Emissions";
import { ThemedView } from "@/components/ThemedView";
import { NavigationButtons } from "../components/quiz/NavigationButtons";
import { Text } from "react-native-paper";
import { QuestionData } from "@/types/QuestionData";
import InputTemplate from "../components/quiz/InputTemplate";
import CheckboxTemplate from "../components/quiz/CheckboxTemplate";
import StepperTemplate from "../components/quiz/StepperTemplate";
import RadioTemplate from "../components/quiz/RadioTemplate";
import { router } from "expo-router";

const QuizIndex = () => {
  const { questionDocumentIds, questionCollection } = useContext(QuizContext);
  const emissionsContext = useContext(EmissionsContext);

  const [questionData, setQuestionData] = useState<QuestionData>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const templates = [InputTemplate, RadioTemplate, CheckboxTemplate, StepperTemplate];

  // Fetch the question based on currentQuestionIndex
  useEffect(() => {
    const fetchQuestion = async () => {
      const currentQuestionId = questionDocumentIds[currentQuestionIndex];
      if (currentQuestionId) {
        try {
          const snapshot = await questionCollection.doc(currentQuestionId).get();
          if (snapshot.exists) {
            const fetchedQuestionData = snapshot.data();
            setQuestionData(fetchedQuestionData);
          } else {
            console.log("No document found for this question");
          }
        } catch (error) {
          console.error("Error fetching document:", error);
        }
      }
    };
  
    fetchQuestion();
  }, [currentQuestionIndex, questionDocumentIds, questionCollection]);

  const handleAnswer = (value: any) => {
    const variable = questionData?.variable;
    
    if (['9', '10', '11'].includes(questionDocumentIds[currentQuestionIndex])){
      value *= 2;
    }
    if (variable){
      const setter = emissionsContext[`set${variable.charAt(0).toUpperCase()}${variable.slice(1)}`];
      setter(value);
    }
  }

  // Move to the next question, taking skip logic into account
  const goToNextComponent = () => {
    const skipSteps = 1;
    const newIndex = currentQuestionIndex + skipSteps;

    // Ensure the new index does not exceed number of questions
    if (newIndex < questionDocumentIds.length) {
      setCurrentQuestionIndex(newIndex);
    } else {
      router.push('/(quiz)/QuizEnd')
    }
  };

  // Move to the previous question, taking skip logic into account
  const goToPrevComponent = () => {
    const newIndex = currentQuestionIndex - 1;

    // Ensure the new index does not exceed number of questions
    if (newIndex >= 0) {
      setCurrentQuestionIndex(newIndex);
    } else {
      console.log("No more components");
    }
  };

  // Dynamically render the template based on current question
  const CurrentComponent = questionData
    ? templates[questionData.template]
    : templates[0];

  return (
    <ThemedView className="flex-1 p-4">
      {questionData ? (
        <>
          <CurrentComponent
            key={questionData.variable}
            question={questionData.question}
            choices={questionData.choices}
            defaultValue={emissionsContext[questionData.variable]}
            category={questionData.category}
            inputLabel={questionData.input_label}
            onAnswer={handleAnswer}
            steppers={questionData.steppers}
          />
          <View className="flex-row justify-center mt-4">
            <NavigationButtons
              title="Back"
              variant="secondary"
              onPress={goToPrevComponent}
            />
            <NavigationButtons
              title="Next"
              variant="primary"
              onPress={goToNextComponent}
            />
          </View>
        </>
      ) : (
        <View>
          <Text>Loading...</Text>
        </View> // or any other loading indicator
      )}
    </ThemedView>
  );
};

export default QuizIndex;
