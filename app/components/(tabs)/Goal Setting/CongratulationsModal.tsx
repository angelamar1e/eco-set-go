// CongratulationsModal.tsx
import React from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { styled } from 'nativewind';
import { Text, Layout } from '@ui-kitten/components';
import { myTheme } from '@/constants/custom-theme';

const StyledText = styled(Text);
const StyledLayout = styled(Layout);
interface CongratulationsModalProps {
  visible: boolean;
  onClose: () => void;
  onSetNewGoal: () => void;
}

const CongratulationsModal: React.FC<CongratulationsModalProps> = ({
  visible,
  onClose,
  onSetNewGoal,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <StyledLayout 
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <StyledLayout 
          className="w-4/5 rounded-3xl p-6"
          style={{ 
            backgroundColor: 'white',
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <StyledText 
            className="text-center mb-2"
            style={{ 
              fontFamily: 'Poppins-SemiBold',
              fontSize: 20,
              color: myTheme['color-basic-800']
            }}
          >
            🎉 Congratulations! 🎉
          </StyledText>
          
          <StyledText 
            className="text-center mb-4"
            style={{ 
              fontFamily: 'Poppins-Regular',
              fontSize: 14,
              color: myTheme['color-basic-600']
            }}
          >
            You’ve successfully reduced your carbon emissions
          </StyledText>
          
          <StyledText 
            className="mb-6 text-center"
            style={{ 
              fontFamily: 'Poppins-Regular',
              fontSize: 14,
              color: myTheme['color-basic-600'],
              lineHeight: 20
            }}
          >
            Let’s keep up the great work!
          </StyledText>

          <TouchableOpacity 
            className="py-2 rounded-full mb-2 items-center justify-center"
            style={{ backgroundColor: myTheme['color-success-700'] }}
            onPress={onSetNewGoal}
          >
            <StyledText 
              style={{ 
                fontFamily: 'Poppins-SemiBold',
                fontSize: 14,
                color: 'white'
              }}
            >
              Set Another Goal 🎯
            </StyledText>
          </TouchableOpacity>

          <TouchableOpacity 
            className="py-2 rounded-full items-center justify-center border"
            style={{ 
              borderColor: myTheme['color-basic-400'],
              backgroundColor: 'transparent'
            }}
            onPress={onClose}
          >
            <StyledText 
              style={{ 
                fontFamily: 'Poppins-SemiBold',
                fontSize: 14,
                color: myTheme['color-basic-600']
              }}
            >
              Close
            </StyledText>
          </TouchableOpacity>
        </StyledLayout>
      </StyledLayout>
    </Modal>
  );
};

export default CongratulationsModal;
