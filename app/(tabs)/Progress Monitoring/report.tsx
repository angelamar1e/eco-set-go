import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Dimensions,
  SectionListComponent,
  TouchableOpacity,
  Appearance,
  ScrollView,
} from "react-native";
import { BarChart, StackedBarChart } from "react-native-chart-kit";
import { styled } from "nativewind";
// import Card from "react-native-paper";
import { Text, Layout, Card, ViewPager } from "@ui-kitten/components";
import { useLogsContext } from "@/contexts/UserLogs";
import { myTheme } from "@/constants/custom-theme";
import GoalSetting from "@/app/components/(tabs)/Progress Monitoring/GoalSetting";
import {
  conditionalConvertGramsToKg,
  convertTonsToGrams,
} from "@/app/utils/EstimationUtils";
import { EmissionsDataContext } from "@/contexts/EmissionsData";
import { set } from "@react-native-firebase/database";
import { DEFAULT_X_LABELS_HEIGHT_PERCENTAGE } from "react-native-chart-kit/dist/AbstractChart";
import { EmissionsData } from "../../../constants/DefaultValues";
import { EmissionsContext } from "@/contexts/Emissions";
import { useUserContext } from "@/contexts/UserContext";
import { ActivityIndicator } from "react-native-paper";
import { convertGramsToKg } from '../../utils/EstimationUtils';

// Define types for report data
type ReportData = {
  Daily: Record<
    string,
    { Food: number; Transportation: number; Electricity: number }
  >;
  Weekly: Record<
    string,
    { Food: number; Transportation: number; Electricity: number }
  >;
  Monthly: Record<
    string,
    { Food: number; Transportation: number; Electricity: number }
  >;
};

const StyledLayout = styled(Layout);
const StyledText = styled(Text);
const StyledCard = styled(Card);


// ProgressReport component
const ProgressReport = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const shouldLoadComponent = (index: number): boolean => index === selectedIndex;

  const [period, setPeriod] = useState<"Daily" | "Weekly" | "Monthly">("Daily");
  const [colorScheme, setColorScheme] = useState<"light" | "dark">(
    Appearance.getColorScheme() || "light"
  );

  const {
    dailyImpact,
    weeklyImpact,
    monthlyImpact,
    totalImpact,
    stackedChartData,
    handlePeriodChange,
  } = useLogsContext();
  const { initialFootprint, currentFootprint } = useUserContext();

  // Chart data state
  const [chartData, setChartData] = useState({
    labels: [],
    legend: ["Food", "Transportation", "Electricity"],
    data: [[0]],
    barColors: ["#FF6384", "#36A2EB", "#FFCE56"],
  });

  // Update chartData when stackedChartData changes
  useEffect(() => {
    if (stackedChartData) {
      setChartData(stackedChartData);
    }
  }, [stackedChartData]);

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

  const renderDataValues = () => {
    return (
      <View style={{ height: 400 }}>
        <ScrollView 
          className="flex-wrap"
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          contentContainerStyle={{
            padding: 16
          }}
        >
          {stackedChartData.labels.map((label: string, index: number) => (
            <View 
              key={index} 
              className="mb-4 p-4 rounded-lg flex-wrap" 
              style={{
                backgroundColor: myTheme['color-basic-200'],
                borderColor: myTheme['color-basic-300'],
                borderWidth: 1,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 1,
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins-Medium",
                  fontSize: 13,
                  color: myTheme["color-success-700"],
                }}
              >
                {label}
              </Text>
              {stackedChartData.data[index].map((value: number, subIndex: number) => (
                <View 
                  key={subIndex} 
                  className="flex-row justify-between items-center py-1 px-5"
                  style={{
                    borderBottomWidth: subIndex !== stackedChartData.data[index].length - 1 ? 1 : 0,
                    borderBottomColor: `${myTheme['color-basic-300']}50`
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Poppins-Regular", 
                      fontSize: 13,
                      color: myTheme["color-basic-600"],
                    }}
                  >
                    {stackedChartData.legend[subIndex]}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Poppins-Medium",
                      fontSize: 13,
                      color: myTheme["color-basic-800"],
                      marginLeft: 20
                    }}
                  >
                    {convertGramsToKg(value).toFixed(2)} kg CO₂e
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };
  
  

  const renderStackedBarChart = () => {
    const currentColors = chartColors[colorScheme];
  
    const chartConfig = {
      backgroundColor: currentColors.background,
      backgroundGradientFrom: currentColors.background,
      backgroundGradientTo: currentColors.background,
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      labelColor: (opacity = 1) => "#8F9BB3",
      barPercentage: 0.5,
      decimalPlaces: 0,
    };
  
    const legendData = [
      { name: "Food", color: currentColors.bars[0] },
      { name: "Transportation", color: currentColors.bars[1] },
      { name: "Electricity", color: currentColors.bars[2] },
    ];
  
    return (
      <>
        <View className="items-center justify-center" style={{backgroundColor: "white"}}>
          <View>
            <StackedBarChart
              data={{
                labels: stackedChartData.labels,
                data: stackedChartData.data,
                barColors: currentColors.bars,
                legend: ["Food", "Transportation", "Electricity"],
              }}              
              width={Dimensions.get("window").width + 60}
              height={220}
              chartConfig={chartConfig}
              style={{marginEnd: 15 }}
              fromZero
              hideLegend
              withHorizontalLabels={false}
              withVerticalLabels={true}
            />
          </View>
          <View className="flex-row mt-3">
            {legendData.map((item, index) => (
              <View key={index} className="flex-row items-center mx-5">
                <View
                  style={{
                    width: 13,
                    height: 13,
                    backgroundColor: item.color,
                    marginRight: 4,
                    borderRadius: 90,
                  }}
                />
                <Text
                  className="justify-center"
                  style={{
                    fontFamily: "Poppins-Regular",
                    fontSize: 13,
                    color: currentColors.text,
                  }}
                >
                  {item.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </>
    );
  };
  
  if (!stackedChartData && !isStackedChartDataValid()){
    return (
      <StyledLayout className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={myTheme['color-success-700']} />
      </StyledLayout>
    );
  }

  return (
    <StyledLayout className="flex-1">
      <StyledLayout
        className="h-1/6 rounded-b-2xl justify-center items-center relative"
        style={{ backgroundColor: myTheme["color-success-700"] }}
      >
        <StyledText
          className="text-white text-2xl"
          style={{ fontFamily: "Poppins-SemiBold" }}
        >
          Progress
        </StyledText>
      </StyledLayout>

        <StyledLayout className="flex-1">
          <GoalSetting />
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 50
              }}
            >
          <View className="flex-row justify-center mt-2 mb-3 px-2 h-32">
            {/* Total Impact Layout */}
            <StyledLayout
              className="flex-1 mx-1.5 rounded-3xl justify-center overflow-hidden"
              style={{
                backgroundColor: 'transparent',
                elevation: 4,
                shadowColor: myTheme["color-success-700"],
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: myTheme["color-success-700"],
                }}
              >
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: myTheme["color-success-800"],
                    opacity: 0.3,
                    borderRadius: 24,
                  }}
                />
              </View>
              <View className="items-center">
                <Text
                  style={{
                    fontFamily: "Poppins-Medium",
                    fontSize: 12,
                    color: 'white',
                    opacity: 0.9,
                    marginBottom: 4,
                  }}
                >
                  Total Impact
                </Text>
                <View className="items-center">
                  <View className="flex-row items-baseline">
                    <Text
                      style={{
                        fontFamily: "Poppins-Bold",
                        fontSize: 24,
                        color: 'white',
                      }}
                    >
                      {conditionalConvertGramsToKg(convertTonsToGrams(totalImpact))}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Poppins-Medium",
                        fontSize: 13,
                        color: 'white',
                        marginLeft: 2,
                      }}
                    >
                      CO₂e
                    </Text>
                  </View>
                </View>
              </View>
            </StyledLayout>

            {/* Emissions Comparison Layout */}

              {/* Container for both emissions */}
              <StyledLayout className="flex-1 p-1" 
                style={{ 
                  borderColor: myTheme['color-success-700'],
                  borderWidth: 1,
                  borderRadius: 24,
                }}
                >
                {/* Initial Emissions */}
                <StyledLayout 
                  className="flex-1 justify-center"
                  style={{
                    backgroundColor: 'transparent',
                  }}
                >
                  <View className="items-center">
                    <Text 
                      style={{ 
                        fontFamily: 'Poppins-Medium',
                        fontSize: 11,
                        color: myTheme['color-basic-600'],
                        marginBottom: 1,
                      }}
                    >
                      Initial Emissions
                    </Text>
                    <View className="flex-row items-baseline">
                      <Text 
                        style={{ 
                          fontFamily: 'Poppins-Bold',
                          fontSize: 18,
                          color: myTheme['color-success-900'],
                        }}
                      >
                        {(initialFootprint).toFixed(2)} tons
                      </Text>
                      <Text 
                        style={{ 
                          fontFamily: 'Poppins-Regular',
                          fontSize: 12,
                          color: myTheme['color-success-900'],
                          marginLeft: 2,
                        }}
                      >
                        CO₂e
                      </Text>
                    </View>
                  </View>
                </StyledLayout>

              {/* Subtle Divider */}
              <View 
                style={{ 
                  height: 1,
                  backgroundColor: `${myTheme['color-basic-500']}40`,
                  marginHorizontal: 16,
                }} 
              />

              {/* Current Emissions */}
              <StyledLayout
                className="flex-1 justify-center"
                style={{
                  backgroundColor: 'transparent'
                }}
              >
                <View className="items-center">
                  <Text 
                    style={{ 
                      fontFamily: 'Poppins-Medium',
                      fontSize: 11,
                      color: myTheme['color-basic-600'],
                      marginBottom: 1,
                    }}
                  >
                    Current Emissions
                  </Text>
                  <View className="flex-row items-baseline">
                    <Text 
                      style={{ 
                        fontFamily: 'Poppins-Bold',
                        fontSize: 20,
                        color: myTheme['color-success-700'],
                      }}
                    >
                      {(currentFootprint).toFixed(2)} tons
                    </Text>
                    <Text 
                      style={{ 
                        fontFamily: 'Poppins-Regular',
                        fontSize: 14,
                        color: myTheme['color-success-700'],
                        marginLeft: 2,
                      }}
                    >
                      CO₂e
                    </Text>
                  </View>
                </View>
              </StyledLayout>
            </StyledLayout>
        </View>
        <StyledLayout
          className="justify-center border-t border-b pb-3 border-gray-200 rounded-xl"
          style={{}}
        >
          <View
            className="mt-3"
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginBottom: 10,
            }}
          >
            {["Daily", "Weekly", "Monthly"].map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  handlePeriodChange(option);
                  setPeriod(option as "Daily" | "Weekly" | "Monthly");
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins-Medium",
                    fontSize: 14,
                    color:
                      period === option
                        ? myTheme["color-success-700"]
                        : myTheme["color-basic-600"],
                  }}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <ViewPager
            selectedIndex={selectedIndex}
            shouldLoadComponent={shouldLoadComponent}
            onSelect={(index) => setSelectedIndex(index)}
          >
            <Layout level="2">{renderStackedBarChart()}</Layout>
            <Layout level="2">
              <Text>{renderDataValues()}</Text>
            </Layout>
          </ViewPager>
        </StyledLayout>
        </ScrollView>
      </StyledLayout>
    </StyledLayout>
  );
};

export default ProgressReport;
