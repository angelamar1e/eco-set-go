import React, { useState, useEffect } from "react";
import { BackHandler, View, Text } from "react-native";
import { styled } from "nativewind";
import { getUserName, getUserUid, handleBackAction } from "../../utils/utils";
import { SafeAreaView } from "react-native-safe-area-context";
import DailyLog from "@/app/components/(tabs)/Home/daily_log";
import firestore from "@react-native-firebase/firestore";
import LogOutButton from "@/app/components/LogOutButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import QuizButton from "@/app/components/QuizButton";
import ImpactCalculator from "@/app/components/(tabs)/Home/impact_calculator";
import { useRouter } from 'expo-router';
import Header from "@/app/components/(tabs)/Home/Header";

const StyledView = styled(View);

const Box = ({ className = "", ...props }) => (
  <StyledView
    className={`flex-1 justify-center bg-lime-800 rounded ${className}`}
    {...props}
  />
);

export default function LandingPage() {
  const router = useRouter();
  const [userUid, setUserUid] = useState<string | undefined>();
  const [userName, setUserName] = useState<string | undefined>();
  const [overallFP, setOverallFP] = useState<number | undefined>();
  const [impactValue, setImpactValue] = useState<number>(0);
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
      setOverallFP(doc.data()!.overall_footprint!.toFixed(2));
    });

    return () => unsubscribe();
  }, [footprint]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackAction
    );

    return () => backHandler.remove();
  }, []);

  const handleImpactChange = (impact: number) => {
    setImpactValue(impact);
  };

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-2">
          <View className="h-1/4 mt-3">
            <View className="flex-row items-center m-3">
              <ThemedText type="title" className="mt-2 w-full">
                Welcome, <Text className="italic text-lime-800">{userName}!</Text>
              </ThemedText> 
            </View>
            <View className="flex flex-row h-full space-x-2 content-center">
              <Box className="rounded-[20px]">
                <Text className="text-center font-medium mb-3 text-xl text-stone-100">
                  Carbon Footprint
                </Text>
                <Text className="text-center bold text-6xl text-stone-100">
                  {overallFP}
                </Text>
                <Text className="text-center italic text-sm text-stone-100">
                  tons of{'\n'}CO2 equivalent
                </Text>
              </Box>

              <View className="flex flex-column h-full w-1/2 space-y-2">
                <Box className="flex-row w-full items-center rounded-[20px] bg-transparent border-2 border-stone-300 mr-5">
                  <ThemedText type="defaultSemiBold" className="flex w-1/2 text-center text-2xl">{impactValue}g</ThemedText>
                  <ThemedText className="flex w-1/2 text-center text-base italic">less than initial record</ThemedText>
                </Box>

                <Box className="flex-row w-full items-center pr-2 rounded-[20px] bg-transparent border-2 border-stone-300 mr-5">
                  <ThemedText type="defaultSemiBold" className="flex w-1/2 text-center text-2xl">0%</ThemedText>
                  <ThemedText className="flex w-1/2 text-center text-base italic text-black-300">of the goal is completed</ThemedText>
                </Box>
              </View>
            </View>

            <ImpactCalculator onImpactUpdate={handleImpactChange} />
            <View className="flex mt-3">
              <DailyLog />
            </View>
          </View>

          <View className="flex-1 mb-20 mt-4">
            <QuizButton />
            <LogOutButton />
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
