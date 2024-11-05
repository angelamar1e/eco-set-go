import React, { useContext, useEffect, useState } from "react";
import { View, Dimensions, SectionListComponent, TouchableOpacity, Appearance } from "react-native";
import { BarChart, StackedBarChart } from "react-native-chart-kit";
import { styled } from "nativewind";
// import Card from "react-native-paper";
import { Text, Layout, Card } from "@ui-kitten/components";
import { useLogsContext } from "@/contexts/UserLogs";
import { myTheme } from "@/constants/custom-theme";
import GoalSetting from "@/app/components/(tabs)/Progress Monitoring/GoalSetting";
import { conditionalConvertGramsToKg, convertTonsToGrams } from "@/app/utils/EstimationUtils";
import { EmissionsDataContext } from "@/contexts/EmissionsData";
import { set } from "@react-native-firebase/database";
import { DEFAULT_X_LABELS_HEIGHT_PERCENTAGE } from "react-native-chart-kit/dist/AbstractChart";

// Define types for report data
type ReportData = {
  Daily: Record<string, { Food: number; Transportation: number; Electricity: number }>;
  Weekly: Record<string, { Food: number; Transportation: number; Electricity: number }>;
  Monthly: Record<string, { Food: number; Transportation: number; Electricity: number }>;
};

const StyledLayout = styled(Layout);
const StyledText = styled(Text);
const StyledCard = styled(Card);


// ProgressReport component
const ProgressReport = () => {
  const [period, setPeriod] = useState<"Daily" | "Weekly" | "Monthly">("Daily");
  const [colorScheme, setColorScheme] = useState<"light" | "dark">(Appearance.getColorScheme() || "light");

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

  const chartColors = {
    light: {
      background: "#f4f5f2",
      text: "#000000",
      //bars: ["#00A3E0", "#FF7A9B", "#FFD700"],
      //bars: ["#F5ED18", "#62A9FF", "#FF7A6B"],
      bars: ["#80D680", "#218838", "#185724"]
    },
    dark: {
      background: "#f4f5f2",
      text: "#ffffff",
      //bars: ["#0096D6", "#FF6A85", "#FFC300"],
      //bars: ["#F2EE18", "#4294FF", "#FF796B"],
      bars: ["#73F29C", "#13B879", "#05665E"]
    },
  };

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme || "light");
    });
    return () => listener.remove();
  }, []);

  const renderStackedBarChart = () => {
    const currentColors = chartColors[colorScheme];
  
    const chartConfig = {
      backgroundColor: currentColors.background,
      backgroundGradientFrom: currentColors.background,
      backgroundGradientTo: currentColors.background,
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      labelColor: (opacity = 1) => '#8F9BB3',
      barPercentage: 0.5,
      decimalPlaces: 0,
    };
  
    const legendData = [
      { name: "Food", color: currentColors.bars[0] },
      { name: "Transportation", color: currentColors.bars[1] },
      { name: "Electricity", color: currentColors.bars[2] },
    ];
  
    return (
      <View className="items-center justify-center">
        <View className="rounded-3xl">
          <StackedBarChart
            data={{
              labels: stackedChartData.labels,
              data: stackedChartData.data,
              barColors: currentColors.bars,
              legend: ["Food", "Transportation", "Electricity"],
            }}
            width={Dimensions.get("window").width - 60}
            height={220}
            chartConfig={chartConfig}
            style={{ borderRadius: 16 }}
            fromZero
            hideLegend
            withHorizontalLabels={false}
          />
        </View>
        <View className="flex-row mt-4">
          {legendData.map((item, index) => (
            <View key={index} className="flex-row items-center mx-5">
              <View style={{ width: 16, height: 16, backgroundColor: item.color, marginRight: 4, borderRadius: 90 }} />
              <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 13, color: currentColors.text }}>
                {item.name}
              </Text>
            </View>
          ))}
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

      <StyledLayout className="flex-1">
        <GoalSetting/>
        <View className="flex-row h-1/4 justify-center mt-3 mb-5">
        {/* <View className="h-full w-full justify-between border flex-row content-start"> */}
          <StyledCard className='h-full w-5/12 p-0 flex mx-2 rounded-3xl' 
            style={{ 
              marginRight: 5, 
              alignItems: 'center', 
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: myTheme['color-success-700'],
              elevation: 5
              }}
            >
            <Text className="" 
              style={{ 
                fontFamily: 'Poppins-Bold', 
                textAlign: 'center', 
                justifyContent: 'center', 
                fontSize: 30, 
                color: myTheme['color-success-700'],
                }}
              >
              {conditionalConvertGramsToKg(convertTonsToGrams(totalImpact))}<Text style={{ fontFamily: 'Poppins-Regular', fontSize: 17 }}>{"\n"}of CO₂e</Text>
            </Text>
            <Text style={{ textAlign: 'center', fontFamily: 'Poppins-Medium', fontSize: 14, color: myTheme['color-basic-600'] }}>Total Impact</Text>
          </StyledCard>

          <StyledCard className='w-5/12 flex mx-2 rounded-3xl' 
            style={{ 
              marginLeft: 5, 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: myTheme['color-success-transparent-100'],
              borderColor: myTheme['color-success-700'],
              }}
            >
            <Text className="" 
              style={{ 
                fontFamily: 'Poppins-Bold', 
                textAlign: 'center', 
                justifyContent: 'center', 
                fontSize: 20, 
                color: myTheme['color-success-900'], 
              }}
            >
              {(totalEmissions).toFixed(2)} tons<Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14 }}>{"\n"}of CO₂e</Text></Text>
            <Text style={{ textAlign: 'center', fontFamily: 'Poppins-Medium', fontSize:12, color: myTheme['color-basic-600']}}>Initial 
              <Text style={{ textAlign: 'center', fontFamily: 'Poppins-Medium', fontSize:12, color: myTheme['color-basic-600']}}> Emissions</Text>
            </Text>
            <Text></Text>
            <Text className="" 
              style={{ 
                fontFamily: 'Poppins-Bold', 
                textAlign: 'center', 
                justifyContent: 'center', 
                fontSize: 24, 
                color: myTheme['color-success-700'], 
              }}
            >
              {(currentFootprint).toFixed(2)} tons<Text style={{ fontFamily: 'Poppins-Regular', fontSize: 16 }}>{"\n"}of CO₂e</Text></Text>
              <Text style={{ textAlign: 'center', fontFamily: 'Poppins-Medium', fontSize:13, color: myTheme['color-basic-600']}}>Current 
                <Text style={{ textAlign: 'center', fontFamily: 'Poppins-Medium', fontSize:13, color: myTheme['color-basic-600']}}> Emissions</Text>
              </Text>
          </StyledCard>
        </View>
        {/* </View> */}

        <StyledCard className="justify-center border rounded-xl mx-1 px-5">
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 10 }}>
            {["Daily", "Weekly", "Monthly"].map(option => (
              <TouchableOpacity key={option} onPress={() => {
                handlePeriodChange(option);
                setPeriod(option as "Daily" | "Weekly" | "Monthly");
              }}>
                <Text style={{ 
                  fontFamily: 'Poppins-Medium', 
                  fontSize: 16, 
                  color: period === option ? myTheme["color-success-700"] : myTheme["color-basic-600"] 
                }}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {renderStackedBarChart()}
        </StyledCard>
      </StyledLayout>
    </StyledLayout>
  );
};

export default ProgressReport;
