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
    "Over a year, a carbon reduction goal of 2 tons (2000 kg) of CO₂e is ideal - that's like growing 30 tree seedlings for 10 years! 🌱"
  ];

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
          <Text 
            className="text-center mb-4"
            style={{ 
              fontFamily: 'Poppins-SemiBold',
              fontSize: 20,
              color: myTheme['color-basic-800'],
            }}
          >
            Setting Your Carbon Goal 🎯
          </Text>

          {tips.map((tip, index) => (
            <View 
              key={index} 
              className="mb-4 p-4 rounded-xl"
              style={{
                backgroundColor: myTheme['color-success-transparent-100'],
              }}
            >
              <Text 
                className="text-justify"
                style={{ 
                  fontFamily: 'Poppins-Regular',
                  fontSize: 14,
                  lineHeight: 20,
                  color: myTheme['color-basic-800'],
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
                      router.push(`/components/(tabs)/Eco Articles/ZFKkaJj9PfOyegEIHwp4`);
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

export default TargetTips;
