// CongratulationsModal.tsx
import React from 'react';
import { Modal, View, Pressable } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';

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
      <View className="flex-1 justify-center items-center bg-opacity-50">
        <View className="w-4/5 bg-white rounded-3xl p-6 shadow-lg">
          <Text className="text-2xl font-bold text-center mb-2">Congratulations! 🎉</Text>
          <Text className="text-center text-xs mb-4">
            You’ve successfully reduced your carbon emissions
          </Text>
          <Text className="mb-6 text-lg text-center">
            Let’s keep up the great work!
          </Text>
          <TouchableOpacity className="bg-green-500 py-2 rounded-3xl mb-4" onPress={() => onSetNewGoal()}>
            <Text className="text-white font-bold text-center">Set Another Goal 🎯</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onClose()} className="border py-2 rounded-3xl">
            <Text className="font-bold text-center">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CongratulationsModal;
