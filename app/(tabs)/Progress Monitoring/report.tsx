import React, { useContext, useState } from "react";
import { View, Dimensions } from "react-native";
import { StackedBarChart } from "react-native-chart-kit";
import { styled } from "nativewind";
import { Text, Layout, Select, SelectItem, Card } from "@ui-kitten/components";
import { useLogsContext } from "@/contexts/UserLogs";
import { myTheme } from "@/constants/custom-theme";
import GoalSetting from "@/app/components/(tabs)/Progress Monitoring/GoalSetting";
import { conditionalConvertGramsToKg, convertTonsToGrams } from "@/app/utils/EstimationUtils";
import { EmissionsDataContext } from "@/contexts/EmissionsData";

const StyledLayout = styled(Layout);
const StyledText = styled(Text);
const StyledCard = styled(Card);

const DataCard = ({ className = "", style = "", ...props }) => {
  return (
    <View className="h-full w-5/12 p-3 flex mx-2 rounded-3xl border" {...props}>
    </View>
  )
}

// ProgressReport component
const ProgressReport = () => {
  const [period, setPeriod] = useState<"Daily" | "Weekly" | "Monthly">("Daily");
  const {
    currentFootprint,
    dailyImpact,
    weeklyImpact,
    monthlyImpact,
    totalImpact,
    stackedChartData,
    handlePeriodChange
  } = useLogsContext();
  const { totalEmissions } = useContext(EmissionsDataContext);

  // Helper function to validate stackedChartData
  const isStackedChartDataValid = () => {
    return (
      stackedChartData &&
      stackedChartData.labels?.length > 0 &&
      stackedChartData.data?.every((dataset: any) => dataset.length > 0)
    );
  };

  // Render Stacked Bar Chart only if data is valid
  const renderStackedBarChart = () => {
    if (!isStackedChartDataValid()) {
      return <StyledText className="text-center mt-4">No data available for the selected period.</StyledText>;
    }

    const chartConfig = {
      backgroundColor: "#ffffff",
      backgroundGradientFrom: "#f4f5f2",
      backgroundGradientTo: "#f4f5f2",
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      barPercentage: 0.5,
      decimalPlaces: 0,
    };

    return (
      <View className="items-center">
        <View className="items-center rounded-3xl bg-gray-100 w-11/12">
          <StackedBarChart
            data={stackedChartData}
            width={Dimensions.get("window").width - 60}
            height={220}
            chartConfig={chartConfig}
            style={{ borderRadius: 16 }}
            fromZero
            hideLegend
            withHorizontalLabels={false}
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
        <StyledText
          className="text-white text-3xl"
          style={{ fontFamily: "Poppins-SemiBold" }}
        >
          Progress
        </StyledText>
      </StyledLayout>

      <StyledLayout className="flex-1 px-2">
        <GoalSetting/>
        <View className="flex-row h-1/6 justify-center border">
          <DataCard>
            <Text>Total Impact</Text>
            <Text>{conditionalConvertGramsToKg(convertTonsToGrams(totalImpact))} of CO₂e</Text>
          </DataCard>
          <DataCard>
            <Text>Initial Emissions</Text>
            <Text>{(totalEmissions).toFixed(2)} tons of CO₂e</Text>
            <Text>Current Emissions</Text>
            <Text>{(currentFootprint).toFixed(2)} tons of CO₂e</Text>
          </DataCard>
        </View>
        <Select
          value={period}
          style={{ marginBottom: 10 }}
        >
          {["Daily", "Weekly", "Monthly"].map(option => (
            <SelectItem key={option} title={option} onPress={() => {
              handlePeriodChange(option);
              setPeriod(option as "Daily" | "Weekly" | "Monthly");
            }}/>
          ))}
        </Select>

        {renderStackedBarChart()}
      </StyledLayout>
    </StyledLayout>
  );
};

export default ProgressReport;
