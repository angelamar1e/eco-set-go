import React, { useState, useEffect, useContext } from 'react';
import { View, Button } from 'react-native';
import { QuizContext } from '@/contexts/QuizContext';
import Calculator from '../components/quiz/Calculator';
import { EmissionsContext } from '@/contexts/EmissionsContext';
import { components } from '../../constants/QuestionComponents';
import { skipConditions } from '@/constants/SkipConditions';
import { ThemedView } from '@/components/ThemedView';
import { NavigationButtons } from '../components/quiz/NavigationButtons';

const QuizIndex = () => {
  const { questionDocumentIds, questionCollection } = useContext(QuizContext);
  const { kmTravelled } = useContext(EmissionsContext);

  const [question, setQuestion] = useState<string>('');
  const [choices, setChoices] = useState<Map<string, number> & Map<string, string>>(new Map());
  const [currentComponentIndex, setCurrentComponentIndex] = useState(0);
  
  // Fetch the question based on currentComponentIndex
  useEffect(() => {
    const fetchQuestion = async () => {
      const currentQuestionId = questionDocumentIds[currentComponentIndex];
      if (currentQuestionId) {
        try {
          const snapshot = await questionCollection.doc(currentQuestionId).get();
          if (snapshot.exists) {
            const questionData = snapshot.data();
            setQuestion(questionData.question);
            setChoices(questionData.choices || new Map());
          } else {
            console.log('No document found for this question');
          }
        } catch (error) {
          console.error('Error fetching document:', error);
        }
      }
    };
    
    fetchQuestion();
  }, [currentComponentIndex, questionDocumentIds, questionCollection]);

    // Function to determine how many steps to skip based on conditions
  const determineSkipSteps = () => {
    let skipSteps = 1;  // Default to advancing one step if no condition is met

    // Loop through the conditions and find the number of steps to skip if the condition is met
    for (const { condition, skipSteps: steps } of skipConditions) {
      console.log("updated km: ",kmTravelled)
      if (condition(kmTravelled)) { 
        skipSteps = steps || 1;  // Use the skipSteps from the condition, or default to 1
        break;
      }
    }

    return skipSteps;
  };

  // Move to the next component, taking skip logic into account
  const goToNextComponent = () => {
    const skipSteps = 1;
    const newIndex = currentComponentIndex + skipSteps;

    // Ensure the new index does not exceed available components
    if (newIndex < components.length) {
      setCurrentComponentIndex(newIndex);
    } else {
      console.log('No more components');
    }
  };

    // Move to the previous component, taking skip logic into account
    const goToPrevComponent = () => {
      const newIndex = currentComponentIndex - 1;
  
      // Ensure the new index does not exceed available components
      if (newIndex >= 0) {
        setCurrentComponentIndex(newIndex);
      } else {
        console.log('No more components');
      }
    };

  // Dynamically render the current component based on currentComponentIndex
  const CurrentComponent = components[currentComponentIndex];

  return (
    <ThemedView className="flex-1 p-4">
      <Calculator/>
      {/* Render the current component with props */}
      <CurrentComponent question={question} choices={choices} />
      <View className='flex-row justify-center mt-4'>
      <NavigationButtons title="Back" variant='secondary' onPress={goToPrevComponent} />
      <NavigationButtons title="Next" variant='primary' onPress={goToNextComponent} />
        </View>
    </ThemedView>
  );
};

export default QuizIndex;
