import { myTheme } from '@/constants/custom-theme';
import { Ionicons } from '@expo/vector-icons';
import { Layout, Modal, Button, Text as KittenText } from '@ui-kitten/components';
import { styled } from 'nativewind';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface TipsProps {
  visible: boolean;
  onClose: () => void;
  tips: string | string[];
}

const StyledLayout = styled(Layout);
const StyledText = styled(KittenText);

const TipsModal: React.FC<TipsProps> = ({ visible, onClose, tips }) => {
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
          <StyledText 
            className="text-center mb-4"
            style={{ 
              fontFamily: 'Poppins-Bold',
              fontSize: 20,
              color: myTheme['color-success-800']
            }}
          >
            Tips 💡
          </StyledText>
          
          {Array.isArray(tips) ? (
            tips.map((tip, index) => (
              <StyledText 
                key={index} 
                className="text-justify mb-3" 
                style={{ 
                  fontFamily: 'Poppins-Regular',
                  fontSize: 14,
                  lineHeight: 20,
                  color: myTheme['color-basic-600']
                }}
              >
                {tip}
              </StyledText>
            ))
          ) : (
            <StyledText 
              className="text-justify mb-3" 
              style={{ 
                fontFamily: 'Poppins-Regular',
                fontSize: 14,
                lineHeight: 20,
                color: myTheme['color-basic-600']
              }}
            >
              {tips}
            </StyledText>
          )}
          
          <TouchableOpacity 
            className="py-2 rounded-full items-center justify-center border mt-2"
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
        </View>
      </View>
    </Modal>
  );
};

export default TipsModal;
