import React, { useState, useEffect, useContext } from "react";
import { BackHandler, View, FlatList } from "react-native";
import { styled } from "nativewind";
import { handleBackAction } from "../../utils/utils";
import { SafeAreaView } from "react-native-safe-area-context";
import DailyLog from "@/app/components/(tabs)/Home/DailyLog";
import firestore from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { Button, Card, Layout, Text, useTheme } from "@ui-kitten/components";
import { myTheme } from "@/constants/custom-theme";
import { Ionicons } from "@expo/vector-icons";
import { useUserContext } from "@/contexts/UserContext";
import LogOutButton from "@/app/components/LogOutButton";
import ReflectionButton from "@/app/components/(tabs)/Goal Setting/ReflectionButton";
import AddActionButton from "@/app/components/(tabs)/Goal Setting/AddActionButton";
import { useLoadFonts } from "@/assets/fonts/loadFonts";
import { useUserGoalContext } from "@/contexts/UserGoalContext";
import { EmissionsDataContext } from "@/contexts/EmissionsData";
import { useLogsContext } from "@/contexts/UserLogs";
import LottieView from "lottie-react-native";
import {
  conditionalConvertGramsToKg,
  convertTonsToGrams,
} from "@/app/utils/EstimationUtils";
import { ActivityIndicator } from "react-native-paper";
import { EmissionsContext } from "@/contexts/Emissions";
import TakeaQuiz from "@/app/(quiz)/takeaquiz";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SustainabilityLoader from "@/app/components/(tabs)/Home/SustainabilityLoader";
import { EcoActionsContext } from "@/contexts/EcoActions";
import Confetti from "@/app/components/(tabs)/Home/Confetti";

const StyledView = styled(View);
const StyledLayout = styled(Layout);
const StyledText = styled(Text);
const StyledCard = styled(Card);
const StyledButton = styled(Button);

const Box = ({ className = "", style = "", ...props }) => (
  <StyledView
    className={`flex-1 justify-center items-center rounded-xl ${className}`}
    style={{ backgroundColor: myTheme["color-success-700"] }}
    {...props}
  />
);

export default function LandingPage() {
  const [showQuizModal, setShowQuizModal] = useState(false);
  const router = useRouter();
  const { username, currentFootprint, initialFootprint, userUid } =
    useUserContext();
  const { latestGoal } = useUserGoalContext();
  const { initializeData, initialLoading } = useContext(EmissionsContext);
  const { setUserLogs, totalImpact, currentLoading, userLogs} = useLogsContext();
  const fontsLoaded = useLoadFonts();

  const firstName = username ? username.split(" ")[0] : "";

  // Fetch user logs from Firestore
  useEffect(() => {
    const unsubscribe = firestore()
      .collection("user_logs")
      .doc(userUid)
      .onSnapshot((doc) => {
        if (doc.exists) {
          try {
            if (doc.data()) {
              setUserLogs(doc.data());
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          setUserLogs({});
        }
      });

    return () => unsubscribe();
  }, [userUid]);

  useEffect(() => {
    const initialize = async () => {
      await initializeData();
    };

    // Function to check if modal has already been shown
    const checkModalStatus = async () => {
      const shown = await AsyncStorage.getItem(`quizModalShown${userUid}`);
      if (!shown) {
        // If not shown, display the modal
        setShowQuizModal(true);
      }
    };

    initialize();
    checkModalStatus();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackAction
    );
    return () => backHandler.remove();
  }, []);

  const theme = useTheme();
  const headertextColor = theme["color-success-900"];
  const { progressPercentage } = useUserGoalContext();
  const { loading } = useContext(EcoActionsContext);

  let percentage = progressPercentage * 100;
  let difference = conditionalConvertGramsToKg(convertTonsToGrams(totalImpact));

  const handleTakeQuiz = async () => {
    setShowQuizModal(false);
    await AsyncStorage.setItem(`quizModalShown${userUid}`, "true"); // Set flag so it doesn’t show again
    router.push("/(quiz)");
  };

  const handleDismiss = async () => {
    setShowQuizModal(false);
    await AsyncStorage.setItem(`quizModalShown${userUid}`, "true"); // Set flag so it doesn’t show again
  };

  const data = [
    {
      id: "1",
      component: (
        <StyledLayout className="flex-1 px-2 pb-20">
          <StyledLayout className="h-1/4 mt-3">
            <StyledLayout className="flex-row items-center m-3 justify-between">
              <StyledText
                className="w-full text-2xl"
                style={{ fontFamily: "Poppins-Bold" }}
              >
                Welcome,{" "}
                <StyledText
                  className="text-2xl"
                  style={{
                    color: myTheme["color-success-600"],
                    fontFamily: "Poppins-Italic",
                  }}
                >
                  {firstName!}! 🌱
                </StyledText>
              </StyledText>
            </StyledLayout>

            <StyledLayout className="flex flex-row h-auto space-x-2 content-center">
              <Box>
                <StyledText
                  className="text-center text-white mb-3 text-16"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  Carbon Footprint
                </StyledText>
                <StyledText
                  className="text-center text-white text-6xl pt-2"
                  style={{ fontFamily: "Poppins-Bold" }}
                >
                  {currentFootprint.toFixed(2)}
                </StyledText>
                <StyledText
                  className="text-center text-white text-13"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  tons of{"\n"}CO₂ equivalent
                </StyledText>
              </Box>
              {/* initial footprint card */}
              <StyledLayout className="flex-column w-1/2 space-y-2">
                {/* First Card - Initial Footprint */}
                <StyledLayout
                  className="flex-row w-full border h-auto items-center justify-center rounded-xl bg-transparent flex-wrap p-3"
                  style={{ borderColor: myTheme["color-basic-500"] }}
                >
                  <StyledText
                    className="text-13"
                    style={{
                      fontFamily: "Poppins-Regular",
                      color: myTheme["color-success-700"],
                    }}
                  >
                    Initial Footprint
                  </StyledText>
                  <StyledView className="flex-row items-center text-center">
                    <StyledText
                      className="text-3xl pt-4"
                      style={{
                        fontFamily: "Poppins-Bold",
                        color: myTheme["color-success-700"],
                      }}
                    >
                      {initialFootprint.toFixed(2)}
                      <StyledText
                        className="text-sm"
                        style={{ fontFamily: "Poppins-Regular" }}
                      >
                        {" "}
                        tons CO₂e
                      </StyledText>
                    </StyledText>
                  </StyledView>
                  <View
                    className="flex-column items-center py-2 mt-2 rounded-xl w-full"
                    style={{
                      backgroundColor: myTheme["color-success-transparent-100"],
                    }}
                  >
                    <StyledText
                      className="text-sm text-center text-white"
                      style={{
                        fontFamily: "Poppins-Regular",
                        color: myTheme["color-basic-700"],
                      }}
                    >
                      Reduced by{" "}
                      <Ionicons
                        name="trending-down"
                        size={14}
                        color={myTheme["color-basic-700"]}
                      />
                    </StyledText>
                    <StyledText
                      className="text-xl font-bold text-center text-white"
                      style={{
                        fontFamily: "Poppins-Regular",
                        color: myTheme["color-success-700"],
                      }}
                    >
                      {difference}
                    </StyledText>
                  </View>
                </StyledLayout>

                {/* Second Card - Goal */}
                <StyledLayout
                  className="flex-row w-full h-auto border items-center justify-center rounded-xl bg-transparent flex-wrap p-3"
                  style={{ borderColor: myTheme["color-basic-500"] }}
                >
                  {latestGoal ? (
                    <>
                      <StyledView className="p-1">
                        <StyledText style={{ fontFamily: "Poppins-Regular" }}>
                          <StyledText
                            className="text-13"
                            style={{
                              fontFamily: "Poppins-Regular",
                              color: myTheme["color-success-700"],
                            }}
                          >
                            Goal:
                          </StyledText>{" "}
                          <StyledText
                            className="text-sm"
                            style={{
                              fontFamily: "Poppins-Regular",
                              color: myTheme["color-basic-700"],
                            }}
                          >
                            Reduce your emissions by{" "}
                          </StyledText>
                          <StyledText
                            className="text-base"
                            style={{
                              fontFamily: "Poppins-Bold",
                              color: myTheme["color-success-700"],
                            }}
                          >
                            {conditionalConvertGramsToKg(
                              latestGoal?.target ?? 0
                            )}
                          </StyledText>
                        </StyledText>
                      </StyledView>

                      <View
                        className="flex-row items-center justify-center py-2 mt-2 rounded-xl w-full"
                        style={{
                          backgroundColor:
                            myTheme["color-success-transparent-100"],
                        }}
                      >
                        <View
                          className="items-center mx-4 border-r px-4"
                          style={{ borderColor: myTheme["color-basic-500"] }}
                        >
                          <StyledText
                            className="text-2xl"
                            style={{
                              fontFamily: "Poppins-SemiBold",
                              color: myTheme["color-success-700"],
                            }}
                          >
                            {percentage > 100 ? 100 : percentage.toFixed(0)}%
                          </StyledText>
                          <View className="flex-row items-center">
                            {/* <StyledText
                              className="text-xs"
                              style={{ fontFamily: "Poppins-Regular", color: myTheme['color-basic-700'] }}
                            >
                              
                            </StyledText> */}
                            {/* <Ionicons name="checkmark" size={14} color={myTheme['color-basic-700']} style={{marginLeft: 4}}/> */}
                          </View>
                        </View>

                        <View className="items-center mx-4 right-4">
                          <StyledText
                            className="text-2xl text-center"
                            style={{
                              fontFamily: "Poppins-SemiBold",
                              color: myTheme["color-success-700"],
                            }}
                          >
                            {latestGoal?.end_date
                              ? Math.ceil(
                                  (latestGoal.end_date.toDate().getTime() -
                                    new Date().getTime()) /
                                    (1000 * 60 * 60 * 24)
                                )
                              : "0"}
                          </StyledText>
                          <View className="flex-row items-center">
                            <StyledText
                              className="text-xs"
                              style={{
                                fontFamily: "Poppins-Regular",
                                color: myTheme["color-basic-700"],
                              }}
                            >
                              days
                            </StyledText>
                            <Ionicons
                              name="time-outline"
                              size={14}
                              color={myTheme["color-basic-700"]}
                              style={{ marginLeft: 4 }}
                            />
                          </View>
                        </View>
                      </View>
                    </>
                  ) : (
                    <StyledLayout className="w-full items-center">
                      <StyledText
                        className="text-base mb-2"
                        style={{
                          fontFamily: "Poppins-Regular",
                          color: myTheme["color-success-700"],
                        }}
                      >
                        Ready to make a difference? 🌍
                      </StyledText>
                      <StyledButton
                        className="rounded-xl w-full"
                        size="medium"
                        appearance="ghost"
                        status="success"
                        onPress={() =>
                          router.push("/(tabs)/Progress Monitoring/report")
                        }
                        style={{
                          backgroundColor:
                            theme["color-success-transparent-200"],
                        }}
                        activeOpacity={0.7}
                      >
                        {(evaProps) => (
                          <StyledView className="flex-row items-center justify-center">
                            <StyledText
                              {...evaProps}
                              style={{
                                fontFamily: "Poppins-Medium",
                                color: theme["color-success-700"],
                              }}
                              className="text-sm"
                            >
                              Let's Set a Goal!
                            </StyledText>
                          </StyledView>
                        )}
                      </StyledButton>
                    </StyledLayout>
                  )}
                </StyledLayout>
              </StyledLayout>
            </StyledLayout>

            <StyledLayout className="flex-row justify-between mt-4">
              <StyledText
                className="text-2xl ml-2 mt-2 w-1/2"
                style={{
                  color: myTheme['color-success-700'],
                  flex: 1,
                  fontFamily: "Poppins-SemiBold",
                }}
              >
                Daily Log{" "}
              </StyledText>
              {/* </StyledLayout> */}
              <View
                className="flex-row justify-center items-center space-x-2"
                style={{ flexDirection: "row" }}
              >
                <AddActionButton />
                <ReflectionButton />
              </View>
            </StyledLayout>
            <DailyLog />
          </StyledLayout>
        </StyledLayout>
      ),
    },
  ];

  if (!fontsLoaded) {
    return <View />; // Or a loading spinner
  }

  // Render loading indicator if data is still being loaded
  if (!username || currentLoading === true || initialLoading === true || userLogs.length === 0 || loading === true) {
    return (
      <StyledLayout className="flex-1 justify-center items-center">
        <LottieView
          source={require("../../../assets/animation/loading.json")}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
        <SustainabilityLoader />
      </StyledLayout>
    );
  }

  return (
    <StyledLayout className="flex-1">
      <SafeAreaView className="flex-1">
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <View>{item.component}</View>}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>

      <TakeaQuiz
        visible={showQuizModal}
        onTakeQuiz={handleTakeQuiz}
        onDismiss={handleDismiss}
      />
    </StyledLayout>
  );
}
