import React, { ReactNode } from "react";
import { Layout, Text, Card, ProgressBar } from "@ui-kitten/components";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { View } from "react-native";

const StyledLayout = styled(Layout);
const StyledText = styled(Text);
const StyledCard = styled(Card);

const Milestones = () => {
  // Define a Card component for consistent styling
  const CustomCard = ({ children }: { children: ReactNode }) => (
    <StyledCard className="bg-white rounded-lg shadow-md p-4 w-[330px] h-[138px] border border-stone-200">
      {children}
    </StyledCard>
  );

  return (
    <StyledLayout className="flex-1 px-2">
      <SafeAreaView className="flex-1 mt-3">
        <StyledLayout className="bg-lime-800 h-1/6 rounded-b-3xl mb-4 justify-center items-center relative">
          <StyledText category="h4" className="text-[28px] text-gray-100 mb-2">
            Milestones
          </StyledText>
        </StyledLayout>

        <View className="items-center -mt-10">
          <CustomCard>
            <StyledText category="h6" className="text-black justify-left mb-2">
              Eco Points
            </StyledText>
            <StyledText category="p1" className="text-black justify-left mt-1 text-[16px]">
              Level 10
            </StyledText>

            <View className="mt-1">
              <ProgressBar
                progress={0.1}
                style={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "#e0e0e0",
                  marginTop: 5,
                  width: "100%",
                }}
              />
            </View>

            <View className="flex-row justify-between mt-2">
              <StyledText category="s1" className="text-black text-[15px]">
                100
              </StyledText>
              <StyledText category="p2" className="text-stone-500 text-[12px] right-[40px]">
                current EcoPoints
              </StyledText>
              <StyledText category="p2" className="text-stone-500 text-[12px] left-[40px]">
                Level 11
              </StyledText>
              <StyledText category="s1" className="text-black text-[15px]">
                1000
              </StyledText>
            </View>
          </CustomCard>
        </View>
      </SafeAreaView>
    </StyledLayout>
  );
};

export default Milestones;
