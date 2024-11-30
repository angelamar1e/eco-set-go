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
      visible={visible}
      animationType="fade"
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 20,
            width: "85%",
            maxWidth: 320,
            elevation: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            overflow: "hidden",
            minHeight: 270,
          }}
        >
          <View
            style={{
              backgroundColor: myTheme["color-success-transparent-100"],
              padding: 12,
              paddingLeft: 20,
              flexDirection: "row",
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins-Bold",
                fontSize: 18,
                color: myTheme["color-success-800"],
              }}
            >
              Setting Your Carbon Goal 🎯
            </Text>
          </View>

          <View style={{ padding: 10 }}>
            {tips.map((tip, index) => (
              <View
                key={index}
                style={{
                  marginBottom: 10,
                  padding: 10,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    fontSize: 14,
                    color: myTheme["color-basic-800"],
                    lineHeight: 18,
                    textAlign: "justify",
                  }}
                >
                  {tip}
                </Text>

                <TouchableOpacity
                  style={{
                    marginTop: 12,
                    borderTopWidth: 1,
                    borderTopColor: `${myTheme["color-success-200"]}30`,
                    paddingTop: 12,
                    alignItems: "center",
                  }}
                  onPress={() => {
                    onClose();
                    router.push("/components/(tabs)/Eco Articles/ZFKkaJj9PfOyegEIHwp4");
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Poppins-Medium",
                      fontSize: 13,
                      color: myTheme["color-success-700"],
                      textDecorationLine: "underline",
                    }}
                  >
                    Learn more
                  </Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              onPress={onClose}
              style={{
                backgroundColor: myTheme["color-basic-200"],
                padding: 4,
                borderRadius: 10,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins-SemiBold",
                  fontSize: 14,
                  color: myTheme["color-success-800"],
                }}
              >
                Got it!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        </View>
      </Modal>
  );
};

export default TargetTips;
