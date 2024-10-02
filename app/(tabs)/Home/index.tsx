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
    <SafeAreaView className="flex-1 px-2">
      <View className="flex h-1/4">
        <Text className="m-3 text-4xl text-lime-800">
          Hello, <Text className="italic">{userName}!</Text>
        </Text> 
        <View className="flex flex-row h-full space-x-2">
          <Box>
            <Text className="text-center font-medium mb-3 text-xl text-gray-100">
              Carbon Footprint
            </Text>
            <Text className="text-center text-6xl text-gray-100">
              {overallFP}
            </Text>
            <Text className="text-center italic text-sm text-gray-100">
              tons of{'\n'}CO2 equivalent
            </Text>
          </Box>
          <View className="flex flex-column h-full w-1/2 space-y-2">
            <Box className="flex-row items-center pr-2">
              <Text className="flex w-1/2 text-center text-3xl text-gray-100">0g</Text>
              <Text className="flex w-1/2 text-center text-base italic text-gray-200">less than initial record</Text>
            </Box>
            <Box className="flex-row items-center pr-2">
              <Text className="flex w-1/2 text-center text-3xl text-gray-100">0%</Text>
              <Text className="flex w-1/2 text-center text-base italic text-gray-200">of the goal is completed</Text>
            </Box>
          </View>
        </View>
        {/* daily log */}
        <View className="flex mt-3">
          <DailyLog />
        </View>
      </View>
        <LogOutButton/>
    </SafeAreaView>
  );
}
