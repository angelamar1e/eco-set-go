import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Stack } from "expo-router";
import Chart from "chart.js/auto";
import { Line } from "react-native-svg";
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
  const { dailyImpact, weeklyImpact, monthlyImpact, handleCategoryChange } = useLogsContext();

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
      backgroundGradientFrom: '#e6f5e1',
      backgroundGradientTo: '#c7e9c0',
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(61, 201, 97, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      style: { borderRadius: 16, marginVertical: 8, paddingRight: 16 },
      propsForLabels: { fontSize: 14, fontWeight: 'bold' },
      propsForHorizontalLabels: { fontSize: 12, color: '#3DC961' },
      propsForVerticalLabels: { fontSize: 12, color: '#3DC961' },
      propsForBackgroundLines: { stroke: '#e0e0e0' },
      animation: { duration: 500, easing: { type: 'linear', duration: 500 } },
      propsForTooltips: { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 8, borderColor: '#3DC961', borderWidth: 1 },
      propsForBackgroundArea: { fill: 'rgba(61, 201, 97, 0.2)', stroke: 'rgba(61, 201, 97, 0.1)' },
    };

    return (
      <View className="items-center">
        <Text style={{ textAlign: 'center', fontSize: 18, marginVertical: 8 }}>Impact (Tons)</Text>
        <LineChart
          data={data}
          width={Dimensions.get('window').width - 80}
          height={220}
          yAxisInterval={100}
          yAxisSuffix="g"
          chartConfig={chartConfig}
          style={{ marginVertical: 8, borderRadius: 16 }}
          bezier
        />
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
          {['Daily', 'Weekly', 'Monthly'].map((p) => (
            <TouchableOpacity key={p} onPress={() => setPeriod(p as Period)}>
              <Text style={{ color: period === p ? theme['color-primary-500'] : theme['text-hint-color'], fontWeight: 'bold' }}>
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Category Selection */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
          {['Food', 'Transportation', 'Electricity'].map((c) => (
            <TouchableOpacity key={c} onPress={() => handleCategoryChange(c as Category)}>
              <Text style={{ color: category === c ? theme['color-primary-500'] : theme['text-hint-color'], fontWeight: 'bold' }}>
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {renderGraph()}
      </StyledLayout>
    </StyledLayout>
  );
};

export default ProgressReport;
