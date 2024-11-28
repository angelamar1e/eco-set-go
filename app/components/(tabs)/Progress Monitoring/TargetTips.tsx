import { myTheme } from '@/constants/custom-theme';
import { Layout, Modal } from '@ui-kitten/components';
import { styled } from 'nativewind';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

interface TargetTipsProps {
  visible: boolean;
  onClose: () => void;
}

const StyledLayout = styled(Layout);

const TargetTips: React.FC<TargetTipsProps> = ({ visible, onClose }) => {
  const tips = [
    "Try setting a carbon reduction goal of 2 tons (2000 kg) of CO₂e - that's like growing 30 tree seedlings for 10 years! 🌱"
  ];

  return (
    <Modal 
      visible={visible}
      animationType="fade"
      backdropStyle={{
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
      }}
    >
      <StyledLayout
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent',
          padding: 20,
        }}
      >
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
          {/* Header */}
          <View 
            style={{
              backgroundColor: myTheme['color-success-transparent-100'],
              padding: 10,
              paddingTop: 15,
              borderBottomWidth: 1,
              borderBottomColor: `${myTheme['color-success-200']}50`,
            }}
          >
            <Text 
              style={{ 
                fontFamily: 'Poppins-SemiBold', 
                fontSize: 15,
                color: myTheme['color-success-700'],
                textAlign: 'center',
              }}
            >
              Setting Your Carbon Goal 🎯
            </Text>
          </View>

          {/* Content */}
          <View style={{ padding: 18 }}>
            {tips.map((tip, index) => (
              <View 
                key={index} 
                style={{
                  backgroundColor: myTheme['color-success-transparent-100'],
                  padding: 14,
                  borderRadius: 12,
                }}
              >
                <Text 
                  style={{ 
                    fontFamily: 'Poppins-Regular',
                    fontSize: 13,
                    color: myTheme['color-basic-800'],
                    lineHeight: 18,
                    textAlign: 'justify',
                    paddingHorizontal: 5,      
                  }}
                >
                  {tip}
                </Text>

                {/* Learn More Link */}
                <View 
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 5,
                    paddingTop: 8,
                    borderTopWidth: 1,
                    borderTopColor: `${myTheme['color-success-200']}30`,
                  }}
                >
                  <Text
                    onPress={() => {
                      onClose();
                      router.push("/components/(tabs)/Eco Articles/GoalSetting");
                    }}
                    style={{ 
                      fontFamily: 'Poppins-Medium',
                      fontSize: 12,
                      color: myTheme['color-success-700'],
                      textDecorationLine: 'underline',
                    }}
                  >
                    Learn more
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Footer */}
          <TouchableOpacity
            onPress={onClose}
            style={{
              borderRadius: 10,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              paddingBottom: 20
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
      </StyledLayout>
    </Modal>
  );
};

export default TargetTips;
