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
const StyledProgressBar = styled(ProgressBar);


const EcoPoints = () => {

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
        <StyledCard className="bg-white border-0" style={{ borderRadius: 25, padding: 0, width: "90%", elevation: 2 }}>

        <StyledText className="text-center mb-1 p-2" style={{ color: maintextcolor, fontFamily: 'Poppins-SemiBold', fontSize: 22}}>Level 10 ⭐</StyledText>
          <View className="items-center">
            <StyledProgressBar
              progress={0.1}
              className="w-full rounded-lg rounded-3xl h-3 mb-1"
            />
          </View>

          <StyledLayout className="flex-row items-center justify-between bg-white">
            <StyledText className="text-20" style={{ fontFamily: 'Poppins-Regular', color: myTheme['color-basic-700']}}>100 <StyledText 
              className="right-10 text-sm" 
              style={{ 
                fontFamily: 'Poppins-Regular', 
                color: subtextColor1 
              }}
            >
              current EcoPoints
              </StyledText>
            </StyledText>
            <StyledText className="text-20" style={{ fontFamily: 'Poppins-SemiBold', color: myTheme['color-basic-700']}}><StyledText 
              className="left-10 text-sm" 
              style={{ 
                fontFamily: 'Poppins-Regular', 
                color: subtextColor1 
              }}
            >Level 11  </StyledText>1000
            </StyledText>
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
            <StyledText className='text-sm text-white' style={{ fontFamily: 'Poppins-Medium'}}>5000 EcoPoints</StyledText>
          </StyledLayout>
        </StyledLayout>
      </StyledLayout>
      <Incentives />
    </StyledLayout>
  );
};

export default EcoPoints;
