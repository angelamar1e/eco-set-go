// import React, { FC, useState } from 'react';
// import { View } from 'react-native';
// import { ThemedView } from '@/components/ThemedView';
// import { ThemedText } from '@/components/ThemedText';
// import { QuestionContainer } from './QuestionContainer';
// import { SuggestedAnswers } from './SuggestedAnswers';
// import { CheckboxChoices } from './Checkbox'; 
// import { NavigationButton } from './NavigationButton';

// interface Template6Props {
//   question: string;
//   answers: string[]; 
//   checkboxes: string[]; 
//   navigationButtonTitle: string;
//   onNavigationPress: () => void;
// }

// const Template6: FC<Template6Props> = ({
//   question,
//   answers,
//   checkboxes,
//   navigationButtonTitle,
//   onNavigationPress,
// }) => {
//   // State to manage selected suggested answer
//   const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

//   // State to manage the checked status of checkboxes
//   const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

//   // Handle suggested answer selection
//   const handleAnswerPress = (answer: string) => {
//     setSelectedAnswer(answer);
//   };

//   // Handle checkbox toggle
//   const handleCheckboxToggle = (item: string) => {
//     setCheckedItems((prevCheckedItems) => ({
//       ...prevCheckedItems,
//       [item]: !prevCheckedItems[item],
//     }));
//   };

//   return (
//     <ThemedView className="flex-1 px-6">
//       <QuestionContainer>
//         <ThemedText type="default" className="text-black mb-3">{question}</ThemedText>

//         {/* Suggested Answers */}
//         <View className="flex-row flex-wrap justify-between mb-3">
//           {answers.map((answer) => (
//             <SuggestedAnswers
//               key={answer}
//               title={answer}
//               isSelected={selectedAnswer === answer}
//               onPress={() => handleAnswerPress(answer)}
//             />
//           ))}
//         </View>

//         {/* Checkboxes */}
//         <View className="flex-row flex-wrap justify-between mb-3">
//           {checkboxes.map((item) => (
//             <CheckboxChoices
//               key={item}
//               title={item}
//               isChecked={checkedItems[item] || false}
//               onPress={() => handleCheckboxToggle(item)}
//             />
//           ))}
//         </View>

//         {/* Navigation Button */}
//         <View className="mt-5 items-center">
//           <NavigationButton
//             title={navigationButtonTitle}
//             variant="primary"
//             /*no navigation logic applied*/
//           />
//         </View>
//       </QuestionContainer>
//     </ThemedView>
//   );
// };

// export default Template6;
