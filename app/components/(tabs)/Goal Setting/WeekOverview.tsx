import React from "react";
import { View } from "react-native";
import { styled } from "nativewind";
import { Text, Layout, useTheme, Card } from "@ui-kitten/components";
import { myTheme } from "@/constants/custom-theme";

const StyledLayout = styled(Layout);
const StyledText = styled(Text);
const StyledCard = styled(Card);

// Define the days and dates for the week
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dates = ["9", "10", "11", "12", "13", "14", "15"];

// List of "done" dates
const doneDates = ["9", "10", "11", "12"];

const WeekOverview: React.FC = () => {

const theme = useTheme();
const headertextColor = theme['color-success-900'];

  return (
    <View className="items-center -mt-14 -bottom-3 mb-6 z-50 justify-items-center">
      <StyledCard className="bg-white border-0" style={{ borderRadius: 25, padding: 0, width: "90%", elevation: 2 }}>

      <StyledLayout className="ml-1 mr-2 relative bg-white">
        <StyledText className="text-center mb-2 text-xl p-2" style={{ color: headertextColor, fontFamily: 'Poppins-SemiBold'}}>
          Week Overview  📆
        </StyledText>

        {/* Flex container for dates and labels */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {dates.map((date, index) => {
            const isDone = doneDates.includes(date);

            return (
              <View key={index} style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 25,
                    backgroundColor: isDone 
                      ? myTheme['color-success-600'] 
                      : myTheme['color-basic-400'],
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 3,
                    paddingTop: 4
                  }}
                >
                  <StyledText className='text-lg' 
                    style={{
                      color: isDone
                      ? 'white'
                      : myTheme['color-basic'],
                      fontFamily: 'Poppins-Regular'}}>
                    {date}
                  </StyledText>
                </View>

                {/* Day Label */}
                <StyledText
                className="text-sm"
                  style={{
                    textAlign: "center",
                    color: myTheme['color-basic-600'],
                    fontFamily: 'Poppins-Medium'
                  }}
                >
                  {weekDays[index]}
                </StyledText>
              </View>
            );
          })}
        </View>
      </StyledLayout>
    </StyledCard>
    </View>
  );
};

export default WeekOverview;
