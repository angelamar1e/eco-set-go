import React, { ReactNode } from "react";
import Incentives from "@/app/components/(tabs)/Rewards/incentives";
import GoToMilestones from "@/app/components/(tabs)/Rewards/MilestonesButton";
import { Stack } from "expo-router";
import { styled } from "nativewind";
import { Button, Layout, Text, ProgressBar, Card } from "@ui-kitten/components";

const StyledLayout = styled(Layout);
const StyledText = styled(Text);
const StyledButton = styled(Button);
const StyledCard = styled(Card);

const EcoPoints = () => {
  const CustomCard = ({ children }: { children: ReactNode }) => (
    <StyledCard className="bg-white rounded-full shadow-md p-4 w-[90%] shadow">
      {children}
    </StyledCard>
  );

  return (
    <StyledLayout className="flex-1">
          <StyledLayout className="bg-lime-800 h-1/4 rounded-lg mb-4 justify-center items-center relative">
            <StyledText category="h4" className="text-white">Eco Rewards</StyledText>
          </StyledLayout>

          <StyledLayout className="items-center -mt-10">
                <CustomCard>
                    <StyledText category="h6">Eco Points</StyledText>
                    <StyledText category="s1">Level 10</StyledText>

                    <StyledLayout className="mt-1">
                        <ProgressBar
                        progress={0.1}
                        className="h-2 rounded-lg bg-gray-300 w-full mt-2"
                        />
                    </StyledLayout>

                    <StyledLayout className="flex-row justify-between mt-2">
                        <StyledText category="s1">100</StyledText>
                        <StyledText category="c1">current EcoPoints</StyledText>
                        <StyledText category="c1">Level 11</StyledText>
                        <StyledText category="s1">1000</StyledText>
                    </StyledLayout>
                </CustomCard>
            </StyledLayout>

          <StyledLayout className="flex-row p-4 justify-between items-center">
                <GoToMilestones />
                <StyledButton 
                    className="p-1 m-1 h-1/2 rounded-full"
                    size="small"
                    status="primary" 
                    onPress={() => {}}>
                    <StyledText category="s1">5000 points</StyledText>
                </StyledButton>
            </StyledLayout>

          <Incentives />

          {/* View More Button */}
          <StyledLayout className="flex-1 items-center">
            <StyledButton appearance="ghost" onPress={() => {}}>
              <StyledText category="s1" className="text-stone-500 text-[15px]">
                More rewards
              </StyledText>
            </StyledButton>
          </StyledLayout>
    </StyledLayout>
  );
};

export default EcoPoints;
