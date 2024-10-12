import React, { useState, useEffect, useContext } from "react";
import { View, Button } from "react-native";
import { QuizContext } from "@/contexts/QuizContext";
import Calculator from "../components/quiz/Calculator";
import { EmissionsContext } from "@/contexts/EmissionsContext";
import { ThemedView } from "@/components/ThemedView";
import { NavigationButtons } from "../components/quiz/NavigationButtons";
import { Text } from "react-native-paper";
import { QuestionData } from "@/types/QuestionData";
import Template2 from "../components/quiz/Template2";
import { Template3 } from "../components/quiz/Template3";
import Template4 from "../components/quiz/Template4";
import Template5 from "../components/quiz/Template5";

const QuizIndex = () => {
  const { questionDocumentIds, questionCollection } = useContext(QuizContext);
  const emissionsContext = useContext(EmissionsContext);

  const [questionData, setQuestionData] = useState<QuestionData>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const templates = [Template2, Template3, Template4, Template5];

  // Fetch the question based on currentQuestionIndex
  useEffect(() => {
    const fetchQuestion = async () => {
      const currentQuestionId = questionDocumentIds[currentQuestionIndex];
      if (currentQuestionId) {
        try {
          const snapshot = await questionCollection
            .doc(currentQuestionId)
            .get();
          if (snapshot.exists) {
            const questionData = snapshot.data();
            setQuestionData(questionData);
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

  // Move to the next question, taking skip logic into account
  const goToNextComponent = () => {
    const skipSteps = 1;
    const newIndex = currentQuestionIndex + skipSteps;

    // Ensure the new index does not exceed number of questions
    if (newIndex < questionDocumentIds.length) {
      setCurrentQuestionIndex(newIndex);
    } else {
      console.log("No more components");
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
      <Calculator />
      {questionData ? (
        <>
          <CurrentComponent
            question={questionData.question}
            choices={questionData.choices}
            defaultValue={questionData.default_value}
            category={questionData.category}
            inputLabel={questionData.input_label}
            onAnswer={emissionsContext[questionData.variable]}
            stepperTitle={questionData.stepperTitles}
            checkboxes={questionData.checkboxes}
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
