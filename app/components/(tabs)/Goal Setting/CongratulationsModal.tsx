// CongratulationsModal.tsx
import { myTheme } from "@/constants/custom-theme";
import { useUserGoalContext } from "@/contexts/UserGoalContext";
import { Timestamp } from "@react-native-firebase/firestore";
import { differenceInDays } from "date-fns";
import React from "react";
import { Modal, View, Pressable } from "react-native";
import { TouchableOpacity } from "react-native";
import { Text, Button } from "react-native-paper";

const StyledText = styled(Text);
const StyledLayout = styled(Layout);
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
  const { latestGoal } = useUserGoalContext();

  const getDifferenceInDays = (start: Timestamp) => {
    if (!start) {
      return "Start date is not defined.";
    }

    const today = new Date().getTime(); // Current time in milliseconds
    const differenceInMilliseconds = today - start.toMillis();

    // Convert milliseconds to days
    const differenceInDays = Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60 * 24)
    );

    return differenceInDays;
  };

  if (latestGoal && latestGoal.start_date) {
    const difference = getDifferenceInDays(latestGoal!.start_date);
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
              justifyContent: "top",
              minHeight: 270,
            }}
          >
            <View
              style={{
                backgroundColor: myTheme["color-success-transparent-100"],
                padding: 12,
                paddingLeft: 20,
                flexDirection: "row",
                // alignItems: "center",
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
                Congratulations! 🥳
              </Text>
            </View>
  
            {/* Content */}
            <View style={{ padding: 18 }}>
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
                You completed your goal{" "}
                {difference === 0 ? (
                  <Text
                    style={{
                      fontFamily: "Poppins-Regular",
                      fontSize: 16,
                      color: myTheme["color-basic-800"],
                      lineHeight: 18,
                      marginBottom: 16,
                      textAlign: "justify",
                      paddingHorizontal: 5,
                    }}
                  >
                    within the day. Let's keep up the great work!
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontFamily: "Poppins-Regular",
                      fontSize: 13,
                      color: myTheme["color-basic-800"],
                      lineHeight: 18,
                      // marginBottom:,
                      textAlign: "justify",
                      paddingHorizontal: 5,
                    }}
                  >
                    in {difference} days
                  </Text>
                )}
              </Text>
  
              {/* <View className="flex-row justify-center space-"> */}
                {/* Button */}
                <TouchableOpacity
                  onPress={onSetNewGoal}
                  style={{
                    backgroundColor: myTheme["color-success-transparent-100"],
                    padding: 4,
                    borderRadius: 10,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: 6,
                    // marginBottom: 6,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Poppins-SemiBold",
                      fontSize: 14,
                      color: myTheme["color-success-800"],
                    }}
                  >
                    Set a new goal 🎯
                  </Text>
                </TouchableOpacity>
                {/* Button */}
                <TouchableOpacity
                  onPress={onClose}
                  style={{
                    backgroundColor: myTheme["color-basic-200"],
                    padding: 4,
                    borderRadius: 10,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: 10
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Poppins-SemiBold",
                      fontSize: 14,
                      color: myTheme["color-basic-600"],
                    }}
                  >
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        {/* </View> */}
      </Modal>
    )
  }
};

export default CongratulationsModal;
