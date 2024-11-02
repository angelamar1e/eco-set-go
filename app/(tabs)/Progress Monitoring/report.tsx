import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Stack } from "expo-router";
import React, { ReactNode, useState, useEffect } from "react";
import { ScrollView, View, Dimensions, TouchableOpacity } from "react-native";
import { ProgressBar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import firestore from "@react-native-firebase/firestore";
import { LineChart, BarChart } from "react-native-chart-kit";
import { styled } from "nativewind";
import moment from "moment";
import { stringify } from "postcss";
import { useUserContext } from "@/contexts/UserContext";
import { Text, Layout, Card, useTheme } from "@ui-kitten/components";
import { myTheme } from "@/constants/custom-theme";
import Logs from "../Goal Setting/logs";
import GoalSetting from "@/app/components/(tabs)/Progress Monitoring/GoalSetting";

const StyledLayout = styled(Layout);
const StyledText = styled(Text);
const StyledCard = styled(Card);
const StyledView = styled(View);

// List of "done" dates
const doneDates = ["9", "10", "11", "12"];

// Periods: daily, weekly, monthly
type Period = "daily" | "weekly" | "monthly";
type Category = "All" | "Food" | "Transportation" | "Electricity";

// ProgressReport component
const ProgressReport = () => {
  const theme = useTheme();
  const headertextColor = theme["color-success-900"];

  const goalDates = {
    startDate: "10/20/2024",
    endDate: "11/05/2024",
  };
  const subtextColor1 = theme["color-basic-600"];
  const valuetextcolor = theme["color-success-700"];

  return (
    <StyledLayout className="flex-1">
      <StyledLayout
        className="h-1/6 rounded-b-2xl justify-center items-center relative"
        style={{
          backgroundColor: myTheme["color-success-700"],
        }}
      >
        <StyledText
          className="text-white text-3xl"
          style={{ fontFamily: "Poppins-SemiBold" }}
        >
          Progress
        </StyledText>
      </StyledLayout>

      <StyledLayout className="flex-1 px-2">
        <GoalSetting />
      </StyledLayout>
    </StyledLayout>
  );
};

const ReportWithPeriod = () => {
  const { userUid } = useUserContext();
  const [dataset, setDataset] = useState<any>(null);
  const [period, setPeriod] = useState<Period>("daily"); // State to manage period (daily, weekly, monthly)
  const [category, setCategory] = useState<Category>("All");

  // Fetch data based on the selected period
  useEffect(() => {
    const fetchUserData = async () => {
      if (userUid) {
        const userLogs = firestore().collection("user_logs").doc(userUid);
        const data = (await userLogs.get()).data();

        if (!data) {
          throw new Error("No logs found with user");
        }
        const currentLog = new Map<string, Map<string, number>>(
          Object.entries(data).map(([date, logs]) => [
            date,
            new Map<string, number>(Object.entries(logs)),
          ])
        );
        if (currentLog) {
          let data = null;
          data = await getEmissionsData(currentLog, period, category);
          setDataset(data);
        }
      }
    };

    fetchUserData();
  }, [userUid, period, category]);

  // Gets the total emissions of the user based on the currentLog and dates provided
  // Outputs a labels and datasets to be able to use it for visualizations
  // Parameters:
  // REQUIRED:
  // currentLog: contains the user_logs data of the user
  // OPTIONAL:
  // date_range: This indicates whether the output shows the data aggragated between
  // Daily, Weekly, Monthly, or Yearly. Only accepts the values "daily", "weekly",
  // "monthly", "yearly"
  // category: This indicates if the logs considered should only be a portion such as
  // "Food", "Transportation", "Electricity" or everything with "All".
  const getEmissionsData = async (
    currentLog: Map<string, Map<string, number>>,
    date_range: string = "daily",
    category: string = "All"
  ) => {
    const emissionData: any = {};
    console.log("Processing");
    const filteredLog = await getCategoricalData(currentLog, category);
    const dates = Array.from(filteredLog.keys()).sort(); // Get all the dates and sort them
    dates.forEach((date) => {
      const currDate = getDateFormat(date, date_range);
      // Initialize emission date range to 0 if it does not exist
      if (!emissionData[currDate]) {
        emissionData[currDate] = 0;
      }
      const dateFilteredLogs = filteredLog.get(date);
      if (!dateFilteredLogs) {
        emissionData[currDate] += 0;
        return;
      }
      const arrDateFilteredLogs = dateFilteredLogs.values();

      for (const value of arrDateFilteredLogs) {
        emissionData[currDate] += value;
      }
    });

    const aggragatedDates = Object.keys(emissionData);
    const emissionTotal = Object.values(emissionData);
    console.log(aggragatedDates);
    console.log(emissionTotal);
    return {
      labels: aggragatedDates,
      datasets: [{ data: emissionTotal }],
    };
  };

  // Get Date format assuming that the string date is of a date format
  const getDateFormat = (date: string, date_range: string) => {
    switch (date_range) {
      case "daily":
        return date;
      case "weekly":
        return moment(date).week();
      case "monthly":
        return moment(date).format("MMMM YYYY");
      case "yearly":
        return moment(date).format("YYYY");
      default:
        throw new Error("Date Range does not accept this string");
    }
  };

  // Returns the valid logs with the specified category.
  // Category can only be "All", "Transportation", "Food", or "Electricity"
  const getCategoricalData = async (
    currentLog: Map<string, Map<string, number>>,
    category: string
  ) => {
    if (category === "All") {
      return currentLog;
    } else if (!["Transportation", "Food", "Electricity"].includes(category)) {
      throw new Error("Categorical Data does not exist");
    }
    // Create a new Map to store the filtered results
    const filteredLog = new Map<string, Map<string, number>>();
    for (const [date, logs] of currentLog) {
      const filteredLogs = new Map<string, number>();

      for (const [key, value] of logs) {
        const eco_action = firestore().collection("eco_actions").doc(key);
        const action = (await eco_action.get()).data();

        if (action && action["category"] === category) {
          filteredLogs.set(key, value);
        }
      }

      // Only add the date if there are any filtered logs for that date
      if (filteredLogs.size > 0) {
        filteredLog.set(date, filteredLogs);
      }
    }
    return filteredLog;
  };

  if (!dataset) {
    return (
      <StyledView className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </StyledView>
    );
  }

  return (
    <StyledView className="flex-1 justify-center items-center">
      {/* Period Switcher */}
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <TouchableOpacity
          onPress={() => setPeriod("daily")}
          style={{ marginRight: 10 }}
        >
          <Text style={{ color: period === "daily" ? "blue" : "black" }}>
            Daily
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setPeriod("weekly")}
          style={{ marginRight: 10 }}
        >
          <Text style={{ color: period === "weekly" ? "blue" : "black" }}>
            Weekly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setPeriod("monthly")}>
          <Text style={{ color: period === "monthly" ? "blue" : "black" }}>
            Monthly
          </Text>
        </TouchableOpacity>
      </View>

      {/* Category Switcher */}
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <TouchableOpacity
          onPress={() => setCategory("All")}
          style={{ marginRight: 10 }}
        >
          <Text style={{ color: category === "All" ? "blue" : "white" }}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setCategory("Food")}
          style={{ marginRight: 10 }}
        >
          <Text style={{ color: category === "Food" ? "blue" : "white" }}>
            Food
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCategory("Transportation")}>
          <Text
            style={{ color: category === "Transportation" ? "blue" : "white" }}
          >
            Transportation
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCategory("Electricity")}>
          <Text
            style={{ color: category === "Electricity" ? "blue" : "white" }}
          >
            Electricity
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chart */}
      <View style={{ paddingBottom: 20 }}>
        <BarChart
          data={dataset}
          width={
            Dimensions.get("window").width -
            Dimensions.get("window").width * 0.2
          }
          height={220}
          yAxisLabel=""
          yAxisSuffix="KG"
          yAxisInterval={1}
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 0,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
          fromZero={true}
          withVerticalLabels={true}
          withHorizontalLabels={false}
          showValuesOnTopOfBars={true}
        />
        <Text>{period.charAt(0).toUpperCase() + period.slice(1)} User Log</Text>
        {/* Line chart */}
      </View>
    </StyledView>
  );
};

export default ProgressReport;
