import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { myTheme } from "@/constants/custom-theme";
import { Ionicons } from '@expo/vector-icons';

interface Modal1Props {
  visible: boolean;
  onClose: () => void;
}

const Modal1: React.FC<Modal1Props> = ({ visible, onClose }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 20,
      }}>
        <View style={{
          backgroundColor: 'white',
          borderRadius: 20,
          width: '85%',
          maxWidth: 320,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          overflow: 'hidden',
          justifyContent: 'center',
        }}>
          <View style={{
            backgroundColor: myTheme['color-success-100'],
            padding: 12,
            paddingLeft: 20,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Text style={{
              fontFamily: 'Poppins-Bold',
              fontSize: 18,
              color: myTheme['color-success-800'],
            }}>
              Hey there! 👋
            </Text>
          </View>

          {/* Content */}
          <View style={{ padding: 18 }}>
            <Text style={{
              fontFamily: 'Poppins-Medium',
              fontSize: 15,
              color: myTheme['color-basic-900'],
              marginBottom: 8,
              textAlign: 'center',
            }}>
              Let's Make Every Answer Count!          
            </Text>
            <Text style={{
              fontFamily: 'Poppins-Regular',
              fontSize: 13,
              color: myTheme['color-basic-600'],
              lineHeight: 18,
              marginBottom: 16,
              textAlign: 'justify',
              paddingHorizontal: 5,
            }}>
              For the most accurate footprint calculation, try to answer all questions! Skip less, learn more! 📊🌱            
            </Text>

            {/* Button */}
            <TouchableOpacity
              onPress={onClose}
              style={{
                borderRadius: 10,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 4,
              }}
            >
              <Text style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 16,
                color: myTheme['color-success-800'],
              }}>
                Got it!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Modal1;
