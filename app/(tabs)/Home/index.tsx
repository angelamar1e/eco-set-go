import React, { useState, useEffect } from "react";
import { BackHandler, Platform, View, Text } from "react-native";
import { styled, withExpoSnack } from "nativewind";
import { getUserName, getUserUid, handleBackAction, handleLogOut } from "../../utils/utils";
import { SafeAreaView } from "react-native-safe-area-context";
import DailyLog from "@/app/components/(tabs)/Home/daily_log";
import { CTAButton } from "@/components/CTAButton";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import LogOutButton from "@/app/components/LogOutButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import QuizButton from "@/app/components/QuizButton";

const StyledView = styled(View);

const Box = ({ className = "", ...props }) => (
  <StyledView
    className={`flex-1 justify-center bg-lime-800 rounded ${className}`}
    {...props}
  />
);

export default function LandingPage() {
  const [userUid, setUserUid] = useState<string | undefined>();
  const [userName, setUserName] = useState<string | undefined>();
  const [overallFP, setOverallFP] = useState<number | undefined>();
  const footprint = firestore().collection("current_footprint").doc(userUid);

  useEffect(() => {
    const fetchUserUid = async () => {
      const uid = await getUserUid();
      setUserUid(uid);
      setUserName(await getUserName(uid));
    };

    fetchUserUid();
  }, []);

  useEffect(() => {
    const unsubscribe = footprint.onSnapshot((doc) => {
      setOverallFP(doc.data()!.overall_footprint);
    });

    return () => unsubscribe();
  },[footprint]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackAction
    );

    // Cleanup function
    return () => backHandler.remove();
  }, []);

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-2">

          <View className="h-1/4 mt-3">
            <View className="flex-row items-center m-3">
              <View className="h-14 w-14 rounded-full bg-stone-300 overflow-hidden mr-2 ml-4">
                {/* add image here */}
              </View>

              <ThemedText type="title" className="ml-2 text-4xl mt-2">
                Welcome, <Text className="italic text-lime-800">{userName}!</Text>
              </ThemedText> 
            </View>

            <ThemedText type="subtitle" className="ml-6 mt-2 mb-3 text-[28px]">
              Summary
            </ThemedText>
          
            <View className="flex flex-row h-full space-x-2">
              <Box className="rounded-[20px] ml-5">
                <Text className="text-center font-medium mb-3 text-xl text-stone-300">
                  Carbon Footprint
                </Text>
                <Text className="text-center bold text-6xl text-stone-300">
                  {overallFP}
                </Text>
                <Text className="text-center italic text-sm text-stone-300">
                  tons of{'\n'}CO2 equivalent
                </Text>
              </Box>

              <View className="flex flex-column h-full w-1/2 space-y-2">
                <Box className="flex-row items-center pr-2 rounded-[20px] bg-transparent border-2 border-stone-300 mr-5">
                  <ThemedText type="defaultSemiBold" className="flex w-1/2 text-center text-3xl">0g</ThemedText>
                  <ThemedText className="flex w-1/2 text-center text-base italic">less than initial record</ThemedText>
                </Box>

                <Box className="flex-row items-center pr-2 rounded-[20px] bg-transparent border-2 border-stone-300 mr-5">
                  <ThemedText type="defaultSemiBold" className="flex w-1/2 text-center text-3xl">0%</ThemedText>
                  <ThemedText className="flex w-1/2 text-center text-base italic text-black-300">of the goal is completed</ThemedText>
                </Box>
              </View>
            </View>
          
            {/* daily log */}
            <View className="flex mt-3">
              <DailyLog />
            </View>
          </View>
        

          {/* Log Out*/}
          <View className="flex-1 mb-20 mt-4">
            <QuizButton />
            <LogOutButton />
          </View>

        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
