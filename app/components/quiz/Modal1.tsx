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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
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
              Hey there! 👋
            </Text>
          </View>

          <View style={{ padding: 18 }}>
            <Text
              style={{
                fontFamily: "Poppins-Medium",
                fontSize: 16,
                color: myTheme["color-basic-800"],
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              Let's Make Every Answer Count!
            </Text>

            <Text
              style={{
                fontFamily: "Poppins-Regular",
                fontSize: 14,
                color: myTheme["color-basic-800"],
                lineHeight: 18,
                marginBottom: 30,
                textAlign: "justify",
                paddingHorizontal: 5,
              }}
            >
              For the most accurate footprint calculation, try to answer all questions! Skip less, learn more! 📊🌱
            </Text>

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

export default Modal1;
