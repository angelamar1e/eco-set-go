import React, { useState, useEffect } from "react";
import { BackHandler, View, Text } from "react-native";
import { styled } from "nativewind";
import { getUserName, getUserUid, handleBackAction } from "../../utils/utils";
import { SafeAreaView } from "react-native-safe-area-context";
import DailyLog from "@/app/components/(tabs)/Home/daily_log";
import firestore from "@react-native-firebase/firestore";
import { ThemedText } from "@/components/ThemedText";
import ImpactCalculator from "@/app/components/(tabs)/Home/impact_calculator";
import { useRouter } from 'expo-router';
import WeekOverview from "@/app/components/(tabs)/Home/WeekOverview";
import { Button, Card, Layout,  } from "@ui-kitten/components";

const StyledView = styled(View);
const StyledLayout = styled(Layout);
const StyledText = styled(Text);
const StyledCard = styled(Card);


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
    <StyledLayout className="flex-1">
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-2">
          <View className="h-1/4 mt-3">
            <View className="flex-row items-center m-3">
              <ThemedText type="title" className="mt-2 w-3/4">
                Welcome, <Text className="italic text-lime-800">{userName}!</Text>
              </ThemedText> 
              <Button style={{marginLeft: 45}} onPress={() => router.push('/Profile/profile')} />
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
            <WeekOverview />
            <DailyLog />
          </View>
        </View>
      </SafeAreaView>
    </StyledLayout>
  );
}
