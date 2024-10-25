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
    const maintextcolor = theme['color-primary-700'];

  return (
    <StyledLayout className="flex-1">
      <StyledLayout className='bg-lime-800 h-1/4 rounded-b-3xl justify-center items-center relative'>
        <StyledText category="h4">Eco Rewards</StyledText>
      </StyledLayout>

      <View className="items-center -mt-20 -bottom-5 mb-3 z-50">
        <StyledCard style={{ borderRadius: 100, padding: 4, width: '90%', elevation: 2}}>
          <StyledText category="h1" className='text-center' style={{ color: maintextcolor }}>Level 10</StyledText>

          <StyledLayout className="mt-1">
            <ProgressBar
              progress={0.1}
              className="h-2 rounded-lg bg-gray-300 w-full mt-2"
            />
          </StyledLayout>

          <StyledLayout className="flex-row items-center justify-between mt-2">
            <StyledText category="s1">100</StyledText>
            <StyledText category="c1" className="right-11">current EcoPoints</StyledText>
            <StyledText category="c1" className="left-11">Level 11</StyledText>
            <StyledText category="s1">1000</StyledText>
          </StyledLayout>
        </StyledCard>
      </View>

      <StyledLayout className="flex-row p-4 mt-2 justify-between items-center">
        <GoToMilestones />
        <StyledLayout className="flex-row items-center">
          <StyledText category='label' className="text-sm">Total</StyledText>
          <StyledLayout 
            className="py-2 px-3 m-1 rounded-full"
            style={{
              backgroundColor: myTheme['color-primary-700']
            }}
          >
            <StyledText category="label">5000 EcoPoints</StyledText>
          </StyledLayout>
        </StyledLayout>
      </StyledLayout>
      <Incentives />
    </StyledLayout>
  );
};

export default EcoPoints;
