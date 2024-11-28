import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Dimensions,
  SectionListComponent,
  TouchableOpacity,
  Appearance,
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
    totalImpact,
    stackedChartData,
    handlePeriodChange,
    userLogs,
    selectedPeriod,
    setData,
    loading,
  } = useLogsContext();
  const { initialFootprint, currentFootprint } = useUserContext();

  // Chart data state
  const [chartData, setChartData] = useState({
    labels: [""], // No labels initially
    legend: ["Food", "Transportation", "Electricity"], // Maintain consistent legends
    data: [[0, 0, 0]], // Valid but empty data structure
    barColors: ["#FF6384", "#36A2EB", "#FFCE56"],
  });

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

  const isChartDataValid = (data: any) => {
    return (
      data &&
      Array.isArray(data.labels) &&
      data.labels.length > 0 &&
      Array.isArray(data.data) &&
      data.data.length > 0 &&
      data.data.every((entry: any) => Array.isArray(entry) && entry.length === 3) // Ensure all rows have 3 values
    );
  }; 

  if (!isChartDataValid(stackedChartData)){
    return (
      <View className="flex-1 justify-center">
        <ActivityIndicator size={"small"} color={myTheme["color-success-600"]}/>
      </View>
    )
  }

  const renderDataValues = () => {
    return (
      <View style={{ padding: 10 }}>
        {stackedChartData.labels.map((label: string, index: number) => (
          <View key={index} style={{ marginBottom: 8 }}>
            <Text
              style={{
                fontFamily: "Poppins-Medium",
                fontSize: 13,
                color: myTheme["color-basic-600"],
              }}
            >
              {label}:
            </Text>
            {stackedChartData.data[index].map((value: number, subIndex: number) => (
              <Text
                key={subIndex}
                style={{
                  fontFamily: "Poppins-Regular",
                  fontSize: 13,
                  color: myTheme["color-basic-800"],
                }}
              >
                {stackedChartData.legend[subIndex]}: {convertGramsToKg(value).toFixed(2)} kg CO₂e
              </Text>
            ))}
          </View>
        ))}
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
        <GoalSetting />
        <View className="flex-row h-1/4 justify-center mt-3 mb-5">
          {/* <View className="h-full w-full justify-between border flex-row content-start"> */}
          <StyledCard
            className="h-full w-5/12 p-0 flex mx-2 rounded-3xl"
            style={{
              marginRight: 5,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: myTheme["color-success-700"],
              elevation: 5,
            }}
          >
            <Text
              className=""
              style={{
                fontFamily: "Poppins-Bold",
                textAlign: "center",
                justifyContent: "center",
                fontSize: 30,
                color: myTheme["color-success-700"],
              }}
            >
              {conditionalConvertGramsToKg(convertTonsToGrams(totalImpact))}
              <Text style={{ fontFamily: "Poppins-Regular", fontSize: 17 }}>
                {"\n"}of CO₂e
              </Text>
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontFamily: "Poppins-Medium",
                fontSize: 14,
                color: myTheme["color-basic-600"],
              }}
            >
              Total Impact
            </Text>
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
              {(initialFootprint).toFixed(2)} tons<Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14 }}>{"\n"}of CO₂e</Text></Text>
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

        <StyledLayout
          className="justify-center border-t border-gray-200 rounded-xl"
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
                    fontSize: 16,
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
      </StyledLayout>
    </StyledLayout>
  );
};

export default ProgressReport;
