import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Stack } from "expo-router";
import Chart from "chart.js/auto";
import { Line } from "react-native-svg";
import React, { ReactNode, useState, useEffect } from "react";
import { ScrollView, View, Dimensions, TouchableOpacity } from "react-native";
import { ProgressBar, shadow } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import firestore from "@react-native-firebase/firestore";
import { LineChart, BarChart } from "react-native-chart-kit";
import { styled } from "nativewind";
import moment from "moment";
import { stringify } from "postcss";
import { useUserContext } from "@/contexts/UserContext";
import { Text, Layout, Card, useTheme, IndexPath, Select, SelectItem } from "@ui-kitten/components";
import { myTheme } from "@/constants/custom-theme";
import Logs from "../Goal Setting/logs";
import GoalSetting from "@/app/components/(tabs)/Progress Monitoring/GoalSetting";
import { useLogsContext } from "@/contexts/UserLogs";

const StyledLayout = styled(Layout);
const StyledText = styled(Text);
const StyledCard = styled(Card);
const StyledView = styled(View);

// Periods: daily, weekly, monthly
type Period = "Daily" | "Weekly" | "Monthly";
type Category = "All" | "Food" | "Transportation" | "Electricity";

// ProgressReport component
const ProgressReport = () => {
  const theme = useTheme();
  const [period, setPeriod] = useState<Period>('Daily');
  const [category, setCategory] = useState<Category>('All');
  const { dailyImpact, weeklyImpact, monthlyImpact, selectedCategory, handleCategoryChange } = useLogsContext();

  const periodOptions: Period[] = ['Daily', 'Weekly', 'Monthly'];
  const categoryOptions: Category[] = ['Food', 'Transportation', 'Electricity'];
  const [expanded, setExpanded] = useState(false);

  const toggleDropdown = () => setExpanded(!expanded);

  // Update report based on the selected period
  let report: Record<string, number>; 
  switch (period) {
    case 'Monthly':
      report = monthlyImpact;
      break;
    case 'Weekly':
      report = weeklyImpact;
      break;
    case 'Daily':
      report = dailyImpact;
      break;
    default:
      report = dailyImpact;
      break;
  }

  const renderGraph = () => {
    const data = {
      labels: Object.keys(report),
      datasets: [{ data: Object.values(report).map(Number) }],
    };

    const chartConfig = {
      backgroundColor: '#ffffff',
      backgroundGradientFrom: '#f4f5f2',
      backgroundGradientTo: '#f4f5f2',
      color: (opacity = 1) => `rgba(61, 201, 97, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      propsForVerticalLabels: { fontSize: 10, color: '#3DC961'},
      animation: { duration: 500, easing: { type: 'linear', duration: 500 } },
      propsForTooltips: { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 8, borderColor: '#3DC961', borderWidth: 1 },
    };

    return (
      <View className="items-center">
      <View className="rounded-3xl bg-gray-100 w-11/12 h-3/5">
        <Text style={{ textAlign: 'center', fontSize: 18, marginVertical: 8 }}>Impact (Tons)</Text>
        <LineChart
          data={data}
          width={Dimensions.get('window').width - 60}
          height={200}
          withHorizontalLabels={false}
          chartConfig={chartConfig}
          bezier
          fromZero
          style={{backgroundColor:'#fffff', borderRadius: 16, paddingRight: 50,}}
          renderDotContent={({ x, y, index }) => (
            <Text
              key={index}
              style={{
                position: 'absolute',
                top: y - 20, // Position the text above the dot
                left: x - 10,
                color: '#3DC961',
                fontSize: 12,
                fontWeight: 'bold',
              }}
            >
              {data.datasets[0].data[index].toFixed(0) + "g"}
            </Text>
          )}
        />
      </View>
      </View>
    );
  };

  return (
    <StyledLayout className="flex-1">
      <StyledLayout
        className="h-1/6 rounded-b-2xl justify-center items-center relative"
        style={{ backgroundColor: myTheme["color-success-700"] }}
      >
        <StyledText className="text-white text-3xl" style={{ fontFamily: "Poppins-SemiBold" }}>
          Progress
        </StyledText>
      </StyledLayout>

      <StyledLayout className="flex-1 px-2">
        <GoalSetting />

{/* Period Selection */}
<Select
        value={period}
        style={{ marginBottom: 10 }}
      >
        {periodOptions.map((option) => (
          <SelectItem key={option} title={option} onPress={() => setPeriod(option)}/>
        ))}
      </Select>

      {/* Category Selection */}
      <Select
        value={selectedCategory}
        style={{ marginBottom: 10 }}
      >
        {categoryOptions.map((option) => (
          <SelectItem key={option} title={option} onPress={() => {handleCategoryChange(option); setExpanded(false);}}/> 
        ))}
      </Select>

        {renderGraph()}
      </StyledLayout>
    </StyledLayout>
  );
};

export default ProgressReport;
