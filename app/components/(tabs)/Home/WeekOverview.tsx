import React from "react";
import { View } from "react-native";
import { styled } from "nativewind";
import { Text, Layout, useTheme } from "@ui-kitten/components";
import { myTheme } from "@/constants/custom-theme";

const StyledLayout = styled(Layout);
const StyledText = styled(Text);

// Define the days and dates for the week
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dates = ["9", "10", "11", "12", "13", "14", "15"];

// List of "done" dates
const doneDates = ["9", "10", "11", "12"];

const WeekOverview: React.FC = () => {

const theme = useTheme();
const headertextColor = theme['color-primary-900'];

  return (
    <StyledLayout className="mt-3 ml-2 mr-2 relative">
      <StyledText category="h5" className="text-center mb-2" style={{ color: headertextColor }}>
        Week Overview
      </StyledText>

      {/* Flex container for dates and labels */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {dates.map((date, index) => {
          const isDone = doneDates.includes(date);

          return (
            <View key={index} style={{ alignItems: "center" }}>
              <View
                style={{
                  width: 47,
                  height: 47,
                  borderRadius: 25,
                  backgroundColor: isDone 
                    ? myTheme['color-success-600'] 
                    : myTheme['color-basic-400'],
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 5,
                }}
              >
                <StyledText category="h6">
                  {date}
                </StyledText>
              </View>

              {/* Day Label */}
              <StyledText
                category="label"
                style={{
                  textAlign: "center",
                  color: myTheme['color-basic-600']
                }}
              >
                {weekDays[index]}
              </StyledText>
            </View>
          );
        })}
      </View>
    </StyledLayout>
  );
};

export default WeekOverview;
