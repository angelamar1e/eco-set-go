import React, { useState, useEffect, useContext } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { QuizContext } from "@/contexts/QuizContext";
import { EmissionsContext } from "@/contexts/Emissions";
import { QuestionData } from "@/types/QuestionData";
import InputTemplate from "../components/quiz/InputTemplate";
import CheckboxTemplate from "../components/quiz/CheckboxTemplate";
import StepperTemplate from "../components/quiz/StepperTemplate";
import RadioTemplate from "../components/quiz/RadioTemplate";
import { router } from "expo-router";
import { styled } from "nativewind";
import { Layout, Text } from "@ui-kitten/components";
import storage from '@react-native-firebase/storage';
import { myTheme } from "@/constants/custom-theme";
import TipsModal from "../components/quiz/tips";
import { NavigationButtons } from "../components/quiz/NavigationButtons";

const StyledLayout = styled(Layout);

const QuizIndex = () => {
  const { questionDocumentIds, questionCollection } = useContext(QuizContext);
  const emissionsContext = useContext(EmissionsContext);
  const [questionData, setQuestionData] = useState<QuestionData>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState<any>(null); 
  const [isModalVisible, setModalVisible] = useState(false);
  const templates = [InputTemplate, RadioTemplate, CheckboxTemplate, StepperTemplate];

  useEffect(() => {
    const fetchQuestion = async () => {
      const currentQuestionId = questionDocumentIds[currentQuestionIndex];
      if (currentQuestionId) {
        try {
          const snapshot = await questionCollection.doc(currentQuestionId).get();
          if (snapshot.exists) {
            const fetchedQuestionData = snapshot.data();
            if (fetchedQuestionData.image) {
              // Load the image URL
              const imageUrl = await loadImage(fetchedQuestionData.image);
              fetchedQuestionData.image = imageUrl; // Set the image URL
            }
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

  const loadImage = async (gsUrl: string): Promise<string | null> => {
    try {
      // Ensure the gsUrl is formatted correctly
      const url = await storage().refFromURL(gsUrl).getDownloadURL(); // Make sure gsUrl is correctly formatted
      return url;
    } catch (error) {
      console.error("Error loading image:", error);
      return null; // Return null if there's an error
    }
  };
  
  
  const handleAnswer = (value: any) => {
    const variable = questionData?.variable;
    if (['9', '10', '11'].includes(questionDocumentIds[currentQuestionIndex])) {
      value *= 2;
    }
    setCurrentAnswer(value); // Update current answer state
    console.log("Answer set:", value); // Log the answer being set
    if (variable) {
      const setter = emissionsContext[`set${variable.charAt(0).toUpperCase()}${variable.slice(1)}`];
      setter(value);
    }
  };

  // Move to the next question, taking skip logic into account
  const goToNextComponent = () => {
    const skipSteps = 1;
    let newIndex = currentQuestionIndex + skipSteps;
    const questionId = questionDocumentIds[currentQuestionIndex];

    // Handle skip logic for question 15 (Checkbox)
    if (questionId === '15') {
        const checkedItems = currentAnswer; // Assume currentAnswer is an array of selected values
        const hasEBike = checkedItems.includes('eBike');
        const hasSVH = checkedItems.includes('smallVh');
        const hasBike = checkedItems.includes('bike');

        if (hasEBike && !hasSVH && !hasBike) {
            newIndex = 15; // Move to question 16
        } else if (hasSVH && !hasEBike && !hasBike) {
            newIndex = 16; // Move to question 17
        } else if (hasBike && !hasEBike && !hasSVH) {
            newIndex = 17; // Skip directly to question 18
        } else if (hasEBike && hasSVH && hasBike) {
            newIndex = 16; // Go to question 16 first
        }
    }

    // Handle skip logic for question 19 (Checkbox)
    if (questionId === '19') {
        const checkedItems = currentAnswer;
        const hasBus = checkedItems.includes('bus');
        const hasJeep = checkedItems.includes('jeep');
        const hasTrike = checkedItems.includes('trike');

        if (hasBus && !hasJeep && !hasTrike) {
            newIndex = 19; // Move to question 20
        } else if (hasJeep && !hasBus && !hasTrike) {
            newIndex = 20; // Move to question 21
        } else if (hasTrike && !hasBus && !hasJeep) {
            newIndex = 21; // Move to question 22
        } else if (hasBus && hasJeep && !hasTrike) {
            newIndex = 19; // Go to question 20
        } else if (hasJeep && hasTrike && !hasBus) {
            newIndex = 20; // Go to question 21
        } else if (hasBus && hasTrike && !hasJeep) {
            newIndex = 19; // Go to question 20
        }
    }

    // Handle skip logic for question 8
    if (questionId === '8') {
        console.log(`Answer for question 8 is: ${currentAnswer}`);
        if (currentAnswer === true) { // Answer is "Yes"
        } else if (currentAnswer === false) { // Answer is "No"
            newIndex += 3; // Skip to 3 questions ahead
        }
    }

    // Handle skip logic for question 12
    if (questionId === '12') {
        console.log(`Answer for question 12 is: ${currentAnswer}`);
        if (currentAnswer === true) { // Answer is "Yes"
        } else if (currentAnswer === false) { // Answer is "No"
            console.log("Answer is 'No' - Skipping 2 questions.");
            newIndex += 2; // Skip to 2 questions ahead
        }
    }

    // Handle skip logic for question 30
    if (questionId === '30') {
        console.log(`Answer for question 30 is: ${currentAnswer}`);
        if (currentAnswer === true) { // Answer is "Yes"
        } else if (currentAnswer === false) { // Answer is "No"
            console.log("Answer is 'No' - Skipping 2 questions.");
            newIndex += 2; // Skip to 2 questions ahead
        }
    }

    // Ensure the new index does not exceed the number of questions
    if (newIndex < questionDocumentIds.length) {
        setCurrentQuestionIndex(newIndex);
    } else {
        router.push('/(quiz)/QuizEnd');
    }
  };

  // Move to the previous question, taking skip logic into account
  const goToPrevComponent = () => {
    const newIndex = currentQuestionIndex - 1;
    // Ensure the new index does not exceed the number of questions
    if (newIndex >= 0) {
      setCurrentQuestionIndex(newIndex);
    } else {
      console.log("No more components");
    }
  };

  // Dynamically render the template based on the current question
  const CurrentComponent = questionData
    ? templates[questionData.template]
    : templates[0];

  return (
    <StyledLayout className="flex-1">
      {questionData ? (
        <>
          {questionData.image && (
            <StyledLayout className="bg-white pt-3"
              style={{
                borderColor: 'white',
                borderWidth: 1,
                borderRadius: 40,
                borderTopEndRadius: 0,
                borderTopStartRadius: 0,
                bottom: 7,
                width: '100%'
              }}
            >
              <Image
                source={{ uri: questionData.image }}
                style={{
                  width: '70%',
                  aspectRatio: 15 / 5,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                }}
              />
            </StyledLayout>
          )}
          <StyledLayout className="pl-4 pr-4">
            <CurrentComponent
              key={questionData.variable}
              question={questionData.question}
              choices={questionData.choices}
              defaultValue={emissionsContext[questionData.variable]}
              category={questionData.category}
              inputLabel={questionData.input_label}
              onAnswer={handleAnswer}
              steppers={questionData.steppers}
              isModalVisible={isModalVisible}
              setModalVisible={setModalVisible}
              tips={Array.isArray(questionData.tips) ? questionData.tips : (questionData.tips ? [questionData.tips] : [])}
            />            
          </StyledLayout>
          <StyledLayout style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 16,
            borderTopWidth: 2,
            borderTopColor: myTheme["color-success-900"],
          }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <NavigationButtons
                title="Back"
                onPress={goToPrevComponent}
              />
              <NavigationButtons
                title="Next"
                onPress={goToNextComponent}
              />
            </View>
          </StyledLayout>

          <TipsModal
            visible={isModalVisible}
            onClose={() => setModalVisible(false)}
            tips={questionData.tips || []}
          />
          </>
        ) : (
          <StyledLayout>
            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 20, padding: 20, }}>Loading...</Text>
          </StyledLayout>
        )}
    </StyledLayout>
  );
};

export default QuizIndex;