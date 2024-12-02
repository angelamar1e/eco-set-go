import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { styled } from "nativewind";
import { Text, Layout, useTheme, Card } from "@ui-kitten/components";
import { myTheme } from "@/constants/custom-theme";
import moment, { weekdays } from "moment";
import { useLogsContext } from "@/contexts/UserLogs";
import { firebase } from "@react-native-firebase/firestore";
import firestore from "@react-native-firebase/firestore";
import { useUserContext } from "@/contexts/UserContext";
import { ActivityIndicator } from "react-native";

const StyledLayout = styled(Layout);
const StyledText = styled(Text);
const StyledCard = styled(Card);

const getWeekDetails = (currentDate: Date = new Date()) => {
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const formatDate = (currentDate: Date) => {
    // Format date as YYYY-MM-DD
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Start of the week (Sunday)

  const daysArray = [];
  const datesArray = [];

  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    daysArray.push(weekDays[i]);
    datesArray.push(formatDate(day));
  }

  return {
    days: daysArray,
    dates: datesArray,
  };
};

// Usage Example
const { days, dates } = getWeekDetails();

const WeekOverview: React.FC = () => {
  const theme = useTheme();
  const headertextColor = theme["color-success-900"];

  const { userLogs } = useLogsContext();
  const { userUid } = useUserContext();
  const [actionsCount, setActionsCount] = useState(0);

  // State hooks for date categories
  const [reds, setReds] = useState<string[]>([]);
  const [oranges, setOranges] = useState<string[]>([]);
  const [yellows, setYellows] = useState<string[]>([]);
  const [greens, setGreens] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = firestore()
      .collection("daily_logs")
      .doc(userUid)
      .onSnapshot((doc) => {
        if (doc.exists && doc.data()) {
          const data = doc.data()!;
          if (data.action_ids){
            setActionsCount(data.action_ids.length);
          }
        } else {
          setActionsCount(0);
        }
      });

    return () => unsub();
  }, [userUid]);

  useEffect(() => {
    setLoading(true);
    // Reset arrays to ensure they are updated on each render
    const newReds: string[] = [];
    const newOranges: string[] = [];
    const newYellows: string[] = [];
    const newGreens: string[] = [];

    dates.forEach((date) => {
      const log = userLogs[date];

      // Check if there is a log for the current date
      if (log) {
        const count = Object.keys(log).length;
        const percentage = count / actionsCount;

        // Categorize based on the count and percentage
        if (count === 0) {
          newReds.push(date);
        } else if (percentage <= 0.4) {
          newOranges.push(date);
        } else if (percentage <= 0.9) {
          newYellows.push(date);
        } else {
          newGreens.push(date);
        }
      }
    });

    // Update the state with new categorized arrays
    setReds(newReds);
    setOranges(newOranges);
    setYellows(newYellows);
    setGreens(newGreens);
    setLoading(false);
  }, [actionsCount, userLogs, dates]);

  return (
    <View className="items-center -mt-14 -bottom-3 mb-6 z-50 justify-items-center">
      <StyledCard
        className="bg-white border-0"
        style={{ borderRadius: 25, padding: 0, width: "90%", elevation: 2 }}
      >
        <StyledLayout className="ml-1 mr-2 relative bg-white">
          <StyledText
            className="text-center mb-1 text-lg p-2"
            style={{ color: headertextColor, fontFamily: "Poppins-Medium" }}
          >
            Week Overview 📆
          </StyledText>

          {loading ? (
          <StyledLayout className="mt-6" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="small" color={myTheme['color-success-600']} />
        </StyledLayout>
          ) : (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              {dates.map((date, index) => {
                let color;
                if (actionsCount === 0) {
                  color = myTheme["color-basic-300"];
                } else if (greens.includes(date)) {
                  color = myTheme["color-success-500"]; // Green color for 'good'
                } else if (yellows.includes(date)) {
                  color = "#fff365"; // Yellow color for 'caution'
                } else if (oranges.includes(date)) {
                  color = "#ffb54c"; // Orange color for 'attention'
                } else if (reds.includes(date)) {
                  color = "#ff6961"; // Red color for 'alert'
                }

                return (
                  <View key={index} style={{ alignItems: "center" }}>
                    <View
                      style={{
                        width: 35,
                        height: 35,
                        borderRadius: 25,
                        backgroundColor: color, // Set the background color dynamically
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 3,
                        paddingTop: 4,
                      }}
                    >
                      <StyledText
                        className="text-12"
                        style={{
                          color: myTheme["color-basic"], // Text color
                          fontFamily: "Poppins-Regular",
                        }}
                      >
                        {date.slice(8)}
                      </StyledText>
                    </View>

                    {/* Day Label */}
                    <StyledText
                      className=""
                      style={{
                        textAlign: "center",
                        color: myTheme["color-basic-600"], // Day label color
                        fontFamily: "Poppins-Regular",
                        fontSize: 12,
                      }}
                    >
                      {days[index]}
                    </StyledText>
                  </View>
                );
              })}
            </View>
          )}
        </StyledLayout>
      </StyledCard>
    </View>
  );
};

export default WeekOverview;
