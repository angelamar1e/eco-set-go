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
              Tips 💡
            </Text>
          </View>

          <View style={{ padding: 18 }}>
            {Array.isArray(tips) ? (
              tips.map((tip, index) => (
                <Text
                  key={index}
                  style={{
                    fontFamily: "Poppins-Regular",
                    fontSize: 13,
                    color: myTheme["color-basic-800"],
                    lineHeight: 18,
                    marginBottom: 16,
                    textAlign: "justify",
                    paddingHorizontal: 5,
                  }}
                >
                  {tip}
                </Text>
              ))
            ) : (
              <Text
                style={{
                  fontFamily: "Poppins-Regular",
                  fontSize: 16,
                  color: myTheme["color-basic-800"],
                  lineHeight: 18,
                  marginBottom: 30,
                  textAlign: "justify",
                  paddingHorizontal: 5,
                }}
              >
                {tips}
              </Text>
            )}

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
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TipsModal;
