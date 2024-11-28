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
import {
  conditionalConvertGramsToKg,
  convertTonsToGrams,
} from "@/app/utils/EstimationUtils";
import { ActivityIndicator } from "react-native-paper";
import { EmissionsContext } from "@/contexts/Emissions";
import TakeaQuiz from "@/app/(quiz)/takeaquiz";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const { initializeData } = useContext(EmissionsContext);
  const { setUserLogs, userLogs, setData, stackedChartData, selectedPeriod } = useLogsContext();
  const fontsLoaded = useLoadFonts();

  const firstName = username ? username.split(" ")[0] : "";

   // Fetch user logs from Firestore
   useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection("user_logs")
      .doc(userUid)
      .onSnapshot(
        (doc) => {
          if (doc.exists) {
            try {
              if (doc.data()){
                setUserLogs(doc.data());
                setLoading(false);
              }
            }
            catch(error){
              console.log("NOPE!", error);
            }
          } else {
            setUserLogs({});
          }
        }
      );

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
  const [loading, setLoading] = useState(true);

  let percentage = progressPercentage * 100;
  let difference = conditionalConvertGramsToKg(
    convertTonsToGrams(initialFootprint - currentFootprint)
  );

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
        <StyledLayout className="flex-1 px-2">
          <StyledLayout className="h-1/4 mt-3">
            <StyledLayout className="flex-row items-center m-3 justify-between">
              <StyledText
                className="w-3/4 text-2xl"
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
              <StyledButton
                className="p-1 m-1 rounded-full"
                size="medium"
                appearance="outline"
                status="basic"
                onPress={() => router.push("/Profile/profile")}
              >
                <Ionicons name="person" />
              </StyledButton>
            </StyledLayout>
            <StyledLayout className="flex flex-row h-auto space-x-2 content-center">
              <Box>
                <StyledText
                  className="text-center text-white mb-3"
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
                  className="text-center text-white text-sm"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  tons of{"\n"}CO2 equivalent
                </StyledText>
              </Box>
              {/* initial footprint card */}
              <StyledLayout className="flex-column w-1/2 space-y-2">
                <StyledCard className="flex-row w-full border h-auto items-center justify-center rounded-xl bg-transparent">
                  <StyledText
                    className="text-lg"
                    style={{ fontFamily: "Poppins-Regular", color: myTheme['color-success-700']}}
                  >
                    Initial Footprint
                  </StyledText>
                  <StyledView className="flex-row items-center text-center">
                  <StyledText
                    className="text-base text-center text-3xl leading-10 pt-6"
                    style={{
                      fontFamily: "Poppins-Bold",
                      color: myTheme["color-success-700"],
                    }}
                  >
                    {initialFootprint.toFixed(2)}
                    <StyledText className="leading-6"  style={{ fontFamily: "Poppins-Regular" }}> tons of {"\n"}CO2 equivalent</StyledText>
                  </StyledText>
                    </StyledView>
                  <View className="flex-column items-center py-2 rounded-xl w-full" style={{backgroundColor: myTheme['color-success-700']}}>
                  <StyledText
                      className="text-base text-center text-white"
                      style={{ fontFamily: "Poppins-Regular" }}
                    >
                      Reduced by
                    </StyledText>
                    <StyledText
                      className="text-xl font-bold text-center text-white"
                      style={{ fontFamily: "Poppins-Regular", textAlign: "center" }}
                    >
                      {difference}
                    </StyledText>

                  </View>
                </StyledCard>
            <StyledCard className="flex-row w-full h-auto items-center justify-center rounded-xl bg-transparent">
              <StyledView>
                <StyledText
                  className="text-lg"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  <StyledText
                    className="text-lg"
                    style={{ fontFamily: "Poppins-Bold", color: myTheme['color-success-700'] }}
                  >
                    Goal:
                  </StyledText>{" "}
                  Reduce your emissions by{" "}
                  <StyledText
                    className="text-lg"
                    style={{ fontFamily: "Poppins-Bold" }}
                  >
                    {conditionalConvertGramsToKg(latestGoal?.target ?? 0)}
                  </StyledText>
                </StyledText>
              </StyledView>
              <StyledView className="rounded-xl flex-row py-2 px-6 items-center mt-2" style={{backgroundColor: myTheme['color-success-700']}}>
              <StyledText
                className="text-2xl text-white"
                style={{ fontFamily: "Poppins-Bold" }}
              >
                {percentage > 100 ? 100 : percentage.toFixed(0)}%
              </StyledText>
              <StyledText
                className="text-base text-white"
                style={{ fontFamily: "Poppins-Regular" }}
              >
                {"  "}
                completed
              </StyledText>
              </StyledView>
              <StyledText
                className="text text-right mt-2"
                style={{ fontFamily: "Poppins-Bold" }}
              >
                {latestGoal?.end_date
                  ? `${Math.ceil((latestGoal.end_date.toDate().getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} day/s left`
                  : "No goal set"}
              </StyledText>
            </StyledCard>
             </StyledLayout>
            </StyledLayout>
            <StyledLayout className="flex-row items-center justify-between mt-4">
              <StyledText
                className="text-3xl mb-2 text-center"
                style={{
                  color: headertextColor,
                  flex: 1,
                  fontFamily: "Poppins-SemiBold",
                }}
              >
                Daily Log{" "}
                {/*<Text style={{ fontSize: 25, marginLeft: 10 }}>🌞💭</Text>*/}
              </StyledText>
            </StyledLayout>
            <View
              className="ml-2"
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <AddActionButton />
              <ReflectionButton />
            </View>
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
  if (!username && currentFootprint === 0 && initialFootprint === 0) {
    return (
      <StyledLayout className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={myTheme["color-success-700"]} />
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