import { myTheme } from '@/constants/custom-theme';
import { Ionicons } from '@expo/vector-icons';
import { Layout, Modal, Button } from '@ui-kitten/components';
import { styled } from 'nativewind';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface TipsProps {
  visible: boolean;
  onClose: () => void;
  tips: string | string[];
}

const StyledLayout = styled(Layout);

const TipsModal: React.FC<TipsProps> = ({ visible, onClose, tips }) => {
  return (
    <Modal
      visible={visible}
     >
      <StyledLayout
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent',
        }}
      >
        <View style={{
          width: '90%',
          padding: 20,
          backgroundColor: 'white',
          borderRadius: 10,
          elevation: 1,
        }}>
          <Text className="text-xl text-center" style={{ fontFamily: 'Poppins-Bold', color: myTheme['color-success-700'] }}>Tips 🤷🏽‍♀️</Text>
          {Array.isArray(tips) ? (
            tips.map((tip, index) => (
              <Text key={index} className='text-justify' style={{ marginTop: 10 }}>{tip}</Text>
            ))
          ) : (
            <Text className="text-justify" style={{ marginTop: 10 }}>{tips}</Text>
          )}
          <Button 
            onPress={onClose}
            appearance='ghost' 
            style={{ 
              alignSelf: 'center',
              borderColor: myTheme['color-success-700'],
              borderRadius: 30,
              marginTop: 10
            }}
          >
            Close
          </Button>
        </View>
      </StyledLayout>
    </Modal>
  );
};

export default TipsModal;
