import React, { ReactNode } from "react";
import Incentives from "@/app/components/(tabs)/Rewards/incentives";
import GoToMilestones from "@/app/components/(tabs)/Rewards/MilestonesButton";
import { styled } from "nativewind";
import { Layout, Text, ProgressBar, Card, useTheme } from "@ui-kitten/components";
import { View } from "react-native";
import { myTheme } from "@/constants/custom-theme";


const StyledLayout = styled(Layout);
const StyledText = styled(Text);
const StyledCard = styled(Card);

const EcoPoints = () => {

  const theme = useTheme();
    const maintextcolor = theme['color-success-700'];
    const subtextColor1 = theme['color-basic-600']; 
    const subtextColor2 = theme['color-basic-900']; 

  return (
    <StyledLayout className="flex-1">
      <StyledLayout className='h-1/6 rounded-b-3xl justify-center items-center relative'
          style={{ backgroundColor: myTheme['color-success-700']}}>
            <StyledText className="text-white text-3xl" style={{ fontFamily: 'Poppins-SemiBold'}}>Eco Rewards</StyledText>
      </StyledLayout>

      <View className="items-center -mt-14 -bottom-3 mb-3 z-50">
        <StyledCard style={{ borderRadius: 100, padding: 1, width: '90%', elevation: 2}} className="bg-white border-0">
          <StyledText className='text-center text-xl' style={{ color: maintextcolor, fontFamily: 'Poppins-Medium' }}>Level 10</StyledText>

          <StyledLayout className="mt-1">
            <ProgressBar
              progress={0.1}
              className="h-2 rounded-lg bg-gray-300 w-full mt-2"
            />
          </StyledLayout>

          <StyledLayout className="flex-row items-center justify-between mt-2 bg-white">
            <StyledText category="s1" style={{ color: subtextColor2 }}>100</StyledText>
            <StyledText category="c1" className="right-11" style={{ color: subtextColor1 }}>current EcoPoints</StyledText>
            <StyledText category="c1" className="left-11" style={{ color: subtextColor1 }}>Level 11</StyledText>
            <StyledText category="s1" style={{ color: subtextColor2 }}>1000</StyledText>
          </StyledLayout>
        </StyledCard>
      </View>

      <StyledLayout className="flex-row p-4 mt-2 mr-2 ml-2 justify-between items-center">
        <GoToMilestones />
        <StyledLayout className="flex-row items-center">
          <StyledText className="text-sm mr-1" style={{ color: subtextColor1, fontFamily: 'Poppins-Regular' }}>Total</StyledText>
          <StyledLayout 
            className="py-1 px-3 rounded-full"
            style={{
              backgroundColor: myTheme['color-success-700']
            }}
          >
            <StyledText className='text-sm' style={{ fontFamily: 'Poppins-Medium'}}>5000 EcoPoints</StyledText>
          </StyledLayout>
        </StyledLayout>
      </StyledLayout>
      <Incentives />
    </StyledLayout>
  );
};

export default EcoPoints;
