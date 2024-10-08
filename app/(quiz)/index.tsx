import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import Question1 from './question1';

const QuizIndex = () => {
    const components = [Question1]

    // State to track which component is currently shown
  const [currentComponentIndex, setCurrentComponentIndex] = useState(0);

  // Function to go to the next component
  const goToNextComponent = () => {
    if (currentComponentIndex < components.length - 1) {
      setCurrentComponentIndex(currentComponentIndex + 1);
    } else {
      console.log('No more components'); // Optionally handle the end of the array
    }
  };

  return (
      <View>
      {components[currentComponentIndex]()}

      <Button title="Next Component" onPress={goToNextComponent} />
    </View>
  );
};

export default QuizIndex;
