import React from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import { Text, Button, Layout } from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { myTheme } from '@/constants/custom-theme';
import { styled } from 'nativewind';

interface TakeaQuizProps {
  visible: boolean;
  onTakeQuiz: () => void;
  onDismiss: () => void;
}

const TakeaQuiz: React.FC<TakeaQuizProps> = ({ visible, onTakeQuiz, onDismiss }) => {
  const router = useRouter();
  const StyledText = styled(Text);
  const StyledLayout = styled(Layout);

  return (
    <Modal
      animationType="fade"
      visible={visible}
    >
      <View className="flex-1 justify-center items-center">
        <View 
          className="w-4/5 rounded-3xl p-6"
          style={{ 
            backgroundColor: 'white',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Ionicons 
            name="help" 
            size={40} 
            color={myTheme['color-success-700']} 
            style={{ alignSelf: 'center', marginBottom: 10 }}
          />
          
          <StyledText 
            className="text-center mb-3"
            style={{ 
              fontFamily: 'Poppins-SemiBold',
              fontSize: 20,
              color: myTheme['color-success-800']
            }}
          >
            Take a Quick Quiz!
          </StyledText>
          
          <StyledText 
            className="text-center mb-4"
            style={{ 
              fontFamily: 'Poppins-Regular',
              fontSize: 14,
              lineHeight: 20,
              color: myTheme['color-basic-600']
            }}
          >
            Get started by taking a short quiz to{' '}
            <Text style={{ fontFamily: 'Poppins-Medium', color: myTheme['color-success-700']}}>
              estimate your carbon footprint
            </Text>{' '}
            and{' '}
            <Text style={{ fontFamily: 'Poppins-Medium', color: myTheme['color-success-700']}}>
              personalize
            </Text>{' '}
            your experience.
          </StyledText>

          <TouchableOpacity 
            className="py-2 rounded-full mb-2 items-center justify-center"
            style={{ backgroundColor: myTheme['color-success-700'] }}
            onPress={onTakeQuiz}
          >
            <StyledText 
              style={{ 
                fontFamily: 'Poppins-SemiBold',
                fontSize: 14,
                color: 'white'
              }}
            >
              Take a Quiz
            </StyledText>
          </TouchableOpacity>

          <TouchableOpacity 
            className="py-2 rounded-full items-center justify-center border"
            style={{ 
              borderColor: myTheme['color-basic-400'],
              backgroundColor: 'transparent'
            }}
            onPress={onDismiss}
          >
            <StyledText 
              style={{ 
                fontFamily: 'Poppins-SemiBold',
                fontSize: 14,
                color: myTheme['color-basic-600']
              }}
            >
              Take the quiz later
            </StyledText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TakeaQuiz;
