import React from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import { Text, Button } from '@ui-kitten/components';
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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: '80%', padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 }}>
          <Ionicons name="help" size={40} color={myTheme['color-primary-500']} />
          <Text style={{ fontFamily: 'Poppins-Medium', textAlign: 'center', marginVertical: 10, fontSize: 20, color: myTheme['color-basic-900'] }}>Take a Quick Quiz!</Text>
          <Text style={{ textAlign: 'center', marginVertical: 10, color: '#6b7280', fontFamily: 'Poppins-Regular' }}>Get started by taking a short quiz to  
            <Text style={{ fontSize:15, fontFamily: 'Poppins-Medium', color: myTheme['color-success-900']}}> estimate your carbon footprint</Text> and 
            <Text style={{ fontSize:15, fontFamily: 'Poppins-Medium', color: myTheme['color-success-900']}}> personalize </Text> 
              your experience.
          </Text>
          <View style={{ flexDirection: 'row', marginTop: 15, alignItems: 'center' }}>
            <Button onPress={onTakeQuiz} style={{ flex: 1, borderRadius: 50, alignItems: 'center' }} status="primary">Take a Quiz</Button>
            <TouchableOpacity onPress={onDismiss}>
              <StyledText className="text-sm font-bold" style={{color: myTheme['color-success-700']}}> Take the quiz later</StyledText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TakeaQuiz;
