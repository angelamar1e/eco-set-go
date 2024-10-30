import React, { useState, useEffect, useContext } from "react";
import { BackHandler, View, FlatList } from "react-native";
import { styled } from "nativewind";
import { handleBackAction } from "../../utils/utils";
import { SafeAreaView } from "react-native-safe-area-context";
import DailyLog from "@/app/components/(tabs)/Home/DailyLog";
import firestore from "@react-native-firebase/firestore";
import { useRouter } from 'expo-router';
import { Button, Card, Layout, Text, useTheme } from "@ui-kitten/components";
import { myTheme } from "@/constants/custom-theme";
import { Ionicons } from "@expo/vector-icons";
import { useUserContext } from "@/contexts/UserContext";
import LogOutButton from "@/app/components/LogOutButton";
import LogOutButton from "@/app/components/LogOutButton";
import ReflectionButton from "@/app/components/(tabs)/Goal Setting/ReflectionButton";
import AddActionButton from "@/app/components/(tabs)/Goal Setting/AddActionButton";

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
  const { username, overallFootprint } = useUserContext();
  const [impactValue, setImpactValue] = useState<number>(0);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackAction
    );
    return () => backHandler.remove();
  }, []);

  const theme = useTheme();
  const headertextColor = theme['color-success-900'];

  const data = [
    {
      id: '1',
      component: (
        <StyledLayout className="flex-1 px-2">
          <StyledLayout className="h-1/4 mt-3">
            <StyledLayout className="flex-row items-center m-3 justify-between">
              <StyledText category="h4" className="w-3/4">
                Welcome,{" "}
                <StyledText
                  category="h4"
                  className="italic"
                  style={{ color: myTheme['color-success-600'] }}
                >
                  {userName!}!
                </StyledText>
              </StyledText>
              <StyledButton
                className="p-1 m-1 rounded-full"
                size="medium"
                appearance="outline"
                status="basic"
                onPress={() => router.push('/Profile/profile')}
              >
                <Ionicons name="person" />
              </StyledButton>
            </StyledLayout>
            <StyledLayout className="flex flex-row h-auto space-x-2 content-center">
              <Box>
                <StyledText category="p1" className="text-center text-white mb-3">
                  Carbon Footprint
                </StyledText>
                <StyledText category="h6" className="text-center text-white text-6xl">
                  {overallFootprint.toFixed(2)}
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
                  <StyledText category="h6" className="text-2xl">0%</StyledText>
                  <StyledText className="text-base text-sm italic">of the goal is completed</StyledText>
                </StyledCard>
              </StyledLayout>
            </StyledLayout>
            <ImpactCalculator onImpactUpdate={handleImpactChange} />
            <StyledLayout className="flex-row items-center justify-between mt-4 ml-3">
              <StyledText category="h4" style={{ color: headertextColor, flex: 1 }}>
                Daily Log <Text style={{ fontSize: 25, marginLeft: 10 }}>🌞💭</Text>
              </StyledText>
              <View className='m-1 mr-3' style={{ flexDirection: 'row', alignItems: 'center' }}>
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

  return (
    <StyledLayout className="flex-1">
      <SafeAreaView className="flex-1">
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View>{item.component}</View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </StyledLayout>
  );
}
