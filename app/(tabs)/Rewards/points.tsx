import React, { ReactNode, useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import Rewards from "@/app/components/(tabs)/Rewards/incentives";
import GoToMilestones from "@/app/components/(tabs)/Rewards/MilestonesButton";
import { styled } from "nativewind";
import { Layout, Text, ProgressBar, Card, useTheme } from "@ui-kitten/components";
import { View } from "react-native";
import { myTheme } from "@/constants/custom-theme";
import { useUserContext } from "@/contexts/UserContext";
import { Milestones, Points, Levels } from "@/constants/Points";
import { useLogsContext } from "@/contexts/UserLogs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";


const StyledLayout = styled(Layout);
const StyledText = styled(Text);
const StyledCard = styled(Card);
const StyledProgressBar = styled(ProgressBar);


const EcoPoints = () => {

  const { points, redeemablePoints } = useUserContext();
  const [currentLevel, setCurrentLevel] = useState<keyof typeof Levels | null>(null);
  const [nextLevel, setNextLevel] = useState<keyof typeof Levels | null>(null);
  const [nextLevelPts, setNextLevelPts] = useState<number | null>(null);
  const [levelProgress, setLevelProgress] = useState(0);

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
      <StyledLayout className='h-1/6 rounded-b-3xl justify-center items-center relative'
          style={{ backgroundColor: myTheme['color-success-700']}}>
            <StyledText className="text-white text-3xl" style={{ fontFamily: 'Poppins-SemiBold'}}>Eco Rewards</StyledText>
      </StyledLayout>

      <View className="items-center -mt-14 -bottom-3 mb-4 z-50 justify-items-center">
        <StyledCard className="bg-white border-0" style={{ borderRadius: 25, padding: 20, width: "90%", elevation: 2 }}>
          <StyledLayout className="flex-row items-center">
            <StyledLayout className="justify-center items-center mr-4">
              <Ionicons name="trophy" size={40} color={myTheme['color-success-700']} />
            </StyledLayout>
            <StyledLayout className="flex-1">
              <StyledText className="text-20 mb-2" style={{ fontFamily: 'Poppins-SemiBold', color: myTheme['color-basic-700']}}>
                {points} <StyledText className="text-sm" style={{ fontFamily: 'Poppins-Regular', color: subtextColor1 }}>EcoPoints</StyledText>
              </StyledText>
              <StyledProgressBar
                progress={levelProgress}
                className="w-full rounded-lg rounded-3xl h-4 mb-2"
                status='success'
              />
              <StyledLayout className="flex-row justify-between items-center">
                <StyledText style={{ color: myTheme['color-success-700'], fontFamily: 'Poppins-SemiBold', fontSize: 16}}>{currentLevel!}</StyledText>
                <StyledLayout className="flex-row items-center">
                  <StyledText style={{ fontFamily: 'Poppins-Regular', color: subtextColor1, fontSize: 12, marginRight: 4 }}>
                    {nextLevelPts! - points} EcoPoints to
                  </StyledText>
                  <StyledText style={{ fontFamily: 'Poppins-SemiBold', color: myTheme['color-success-700'], fontSize: 14 }}>
                    {nextLevel!}
                  </StyledText>
                </StyledLayout>
              </StyledLayout>
            </StyledLayout>
          </StyledLayout>
        </StyledCard>
      </View>

      <StyledLayout className="flex-row p-4 mt-2 mr-2 ml-2 justify-between items-center">
        <GoToMilestones />
        <StyledLayout className="flex-column items-center">
          <StyledText className="text-xs mr-1" style={{ color: subtextColor1, fontFamily: 'Poppins-Regular' }}>Redeemable EcoPoints</StyledText>
          <StyledLayout 
            className="py-1 px-3 rounded-full"
            style={{
              backgroundColor: myTheme['color-success-700']
            }}
          >
            <StyledText className='text-sm text-white' style={{ fontFamily: 'Poppins-Medium'}}>{redeemablePoints} EcoPoints</StyledText>
          </StyledLayout>
        </StyledLayout>
      </StyledLayout>
      <Rewards />
    </StyledLayout>
  );
};

export default EcoPoints;
