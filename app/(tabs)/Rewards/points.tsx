import React, { ReactNode, useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import Rewards from "@/app/components/(tabs)/Rewards/incentives";
import GoToMilestones from "@/app/components/(tabs)/Rewards/MilestonesButton";
import { styled } from "nativewind";
import { Layout, Text, ProgressBar, Card, useTheme, Button } from "@ui-kitten/components";
import { View } from "react-native";
import { myTheme } from "@/constants/custom-theme";
import { useUserContext } from "@/contexts/UserContext";
import { Milestones, Points, Levels } from "@/constants/Points";
import { useLogsContext } from "@/contexts/UserLogs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const StyledLayout = styled(Layout);
const StyledText = styled(Text);
const StyledCard = styled(Card);
const StyledProgressBar = styled(ProgressBar);
const StyledButton = styled(Button);


const EcoPoints = () => {

  const { points, redeemablePoints } = useUserContext();
  const [currentLevel, setCurrentLevel] = useState<keyof typeof Levels | null>(null);
  const [nextLevel, setNextLevel] = useState<keyof typeof Levels | null>(null);
  const [nextLevelPts, setNextLevelPts] = useState<number | null>(null);
  const [levelProgress, setLevelProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const currentLevel = () => {
      const levels = Object.keys(Levels) as Array<keyof typeof Levels>;
      
      // Variables to store the current level and next level
      let currentLevelKey: keyof typeof Levels | null = null;
      let nextLevelKey: keyof typeof Levels | null = null;
      let nextLevelValue: number | null = null;
    
      // Iterate over the levels to find the current level and next level
      for (let i = 0; i < levels.length; i++) {
        const level = levels[i];
        
        if (Levels[level] >= points) {
          currentLevelKey = level;
          
          // Check if the next level exists
          if (i < levels.length - 1) {
            nextLevelKey = levels[i + 1];
            nextLevelValue = Levels[nextLevelKey];
          }

          break;
        }
      }

      const percentage = points / nextLevelValue!

  
      // Return an object with current level and next level information
      setCurrentLevel(currentLevelKey)
      setNextLevel(nextLevelKey);
      setNextLevelPts(nextLevelValue);
      setLevelProgress(percentage);
    };

    currentLevel();
  }, [points])

  const theme = useTheme();
    const maintextcolor = theme['color-success-900'];
    const subtextColor1 = theme['color-basic-600']; 
    const subtextColor2 = theme['color-basic-900']; 

  return (
<StyledLayout className="flex-1">
  <StyledLayout 
    className="h-1/6 rounded-b-3xl justify-center items-center relative"
    style={{ backgroundColor: myTheme['color-success-700'] }}
  >
    <StyledText 
      className="text-white text-3xl" 
      style={{ fontFamily: 'Poppins-SemiBold' }}
    >
      Eco Rewards
    </StyledText>

    {/* Profile Button */}
    <StyledButton
      className="absolute top-4 right-4 p-1 m-1 rounded-full"
      size="medium"
      appearance="outline"
      status="basic"
      onPress={() => router.push("/Profile/profile")}
    >
      <Ionicons name="person" size={20} color="#FFFFFF"/>
    </StyledButton>
  </StyledLayout>

  <View className="items-center -mt-14 -bottom-3 mb-4 z-50 justify-items-center">
    <StyledCard 
      className="bg-white border-0" 
      style={{ borderRadius: 25, padding: 0, width: "90%", elevation: 2 }}
    >
      <StyledText 
        className="text-center mb-1 p-2" 
        style={{ color: maintextcolor, fontFamily: 'Poppins-SemiBold', fontSize: 22 }}
      >
        {currentLevel!} ⭐
      </StyledText>
      <View className="items-center">
        <StyledProgressBar
          progress={levelProgress}
          className="w-full rounded-lg rounded-3xl h-3 mb-1"
        />
      </View>
      <StyledLayout className="flex-row items-center justify-between bg-white">
        <StyledText 
          className="text-20" 
          style={{ fontFamily: 'Poppins-Regular', color: myTheme['color-basic-700'] }}
        >
          {points} 
          <StyledText 
            className="right-10 text-sm" 
            style={{ fontFamily: 'Poppins-Regular', color: subtextColor1 }}
          >
            EcoPoints
          </StyledText>
        </StyledText>
        <StyledText 
          className="text-20" 
          style={{ fontFamily: 'Poppins-SemiBold', color: myTheme['color-basic-700'] }}
        >
          <StyledText 
            className="left-10 text-sm" 
            style={{ fontFamily: 'Poppins-Regular', color: subtextColor1 }}
          >
            {nextLevel!}  
          </StyledText>
          {nextLevelPts!}
        </StyledText>
      </StyledLayout>
    </StyledCard>
  </View>

  <StyledLayout className="flex-row p-4 mt-2 mr-2 ml-2 justify-between items-center">
    <GoToMilestones />
    <StyledLayout className="flex-column items-center">
      <StyledText 
        className="text-xs mr-1" 
        style={{ color: subtextColor1, fontFamily: 'Poppins-Regular' }}
      >
        Redeemable EcoPoints
      </StyledText>
      <StyledLayout 
        className="py-1 px-3 rounded-full"
        style={{ backgroundColor: myTheme['color-success-700'] }}
      >
        <StyledText 
          className="text-sm text-white" 
          style={{ fontFamily: 'Poppins-Medium' }}
        >
          {redeemablePoints} EcoPoints
        </StyledText>
      </StyledLayout>
    </StyledLayout>
  </StyledLayout>

  <Rewards />
</StyledLayout>



    
  );
};

export default EcoPoints;
