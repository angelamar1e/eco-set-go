import React, { useState, useEffect } from "react";
import { BackHandler, View } from "react-native";
import { styled } from "nativewind";
import { getUserName, getUserUid, handleBackAction } from "../../utils/utils";
import { SafeAreaView } from "react-native-safe-area-context";
import DailyLog from "@/app/components/(tabs)/Home/DailyLog";
import firestore from "@react-native-firebase/firestore";
import ImpactCalculator from "@/app/components/(tabs)/Home/impact_calculator";
import { useRouter } from 'expo-router';
import { Button, Card, Layout, Text,  } from "@ui-kitten/components";
import { myTheme } from "@/constants/custom-theme";
import { Ionicons } from "@expo/vector-icons";

const StyledView = styled(View);
const StyledLayout = styled(Layout);
const StyledText = styled(Text);
const StyledCard = styled(Card);
const StyledButton = styled(Button);


const Box = ({ className = "", style = "", ...props }) => (
  <StyledView
    className={`flex-1 justify-center items-center rounded-xl ${className}`}
    style={{ backgroundColor: myTheme['color-success-700'] }}
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
        <StyledLayout className="flex-1 px-2">
          <StyledLayout className="h-1/4 mt-3">
            <StyledLayout className="flex-row items-center m-3 justify-between">
              <StyledText category="h4" className="w-3/4">
                  Welcome, <StyledText category="h4" className="italic"
                  style={{color: myTheme['color-success-600']}}
                >{userName}!</StyledText>
              </StyledText> 
              <StyledButton 
                className="p-1 m-1 rounded-full"
                size="medium"
                appearance="outline"
                status="basic"
                onPress={() => router.push('/Profile/profile')} 
              >
                <Ionicons name="person"/> 
              </StyledButton>
            </StyledLayout>
            
            <StyledLayout className="flex flex-row h-auto space-x-2 content-center">
              <Box>
                <StyledText category="p1" className="text-center text-white mb-3">
                  Carbon Footprint
                </StyledText>
                <StyledText category="h6" className="text-center text-white text-6xl">
                  {overallFP}
                </StyledText>
                <StyledText className="text-center text-white italic text-sm">
                  tons of{'\n'}CO2 equivalent
                </StyledText>
              </Box>

              <StyledLayout className="flex-column w-1/2 space-y-2">
                <StyledCard className="flex-row w-full h-auto items-center justify-center rounded-xl bg-transparent">
                  <StyledText category="h6" className="text-2xl">{impactValue}g</StyledText>
                  <StyledText className="text-base text-sm italic">less than initial record</StyledText>
                </StyledCard>

                <StyledCard className="flex-row w-full h-auto items-center justify-center rounded-xl bg-transparent">
                  <StyledText category="h6" className="text-2xl"> 0%</StyledText>
                  <StyledText className="text-base text-sm italic">of the goal is completed</StyledText>
                </StyledCard>
              </StyledLayout>
            </StyledLayout>

            <ImpactCalculator onImpactUpdate={handleImpactChange} />
            {/*<DailyLog />*/}
          </StyledLayout>
        </StyledLayout>
      </SafeAreaView>
    </StyledLayout>
  );
}
