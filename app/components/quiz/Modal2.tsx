import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { myTheme } from "@/constants/custom-theme";
import { Ionicons } from '@expo/vector-icons';

interface Modal2Props {
  visible: boolean;
  onClose: () => void;
}

const Modal2: React.FC<Modal2Props> = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center" 
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
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
          <Text 
            className="text-center mb-4"
            style={{
              fontFamily: 'Poppins-SemiBold',
              fontSize: 20,
              color: myTheme['color-success-800'],
            }}
          >
            Are you ready? ✨          
          </Text>

          <Text 
            className="text-center mb-2"
            style={{
              fontFamily: 'Poppins-Medium',
              fontSize: 15,
              color: myTheme['color-basic-800'],
            }}
          >
            Update your footprint       
          </Text>

          <Text 
            className="text-center mb-4"
            style={{
              fontFamily: 'Poppins-Regular',
              fontSize: 14,
              lineHeight: 20,
              color: myTheme['color-basic-600'],
            }}
          >
            Your answers will update your initial footprint. Let's see how your eco-journey has evolved! 🌍 🌱
          </Text>

          <TouchableOpacity
            className="py-2 rounded-full items-center justify-center border"
            style={{ 
              borderColor: myTheme['color-basic-400'],
              backgroundColor: 'transparent'
            }}
            onPress={onClose}
          >
            <Text style={{
              fontFamily: 'Poppins-SemiBold',
              fontSize: 14,
              color: myTheme['color-basic-600'],
            }}>
              Got it!
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default Modal2;
