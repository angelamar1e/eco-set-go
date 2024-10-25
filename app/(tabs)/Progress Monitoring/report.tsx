import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Stack } from "expo-router";
import React, { ReactNode, useState, useEffect } from "react";
import { ScrollView, View, Text, Dimensions, TouchableOpacity } from "react-native";
import { ProgressBar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import firestore from '@react-native-firebase/firestore';
import { 
  LineChart, 
  BarChart
} from "react-native-chart-kit";
import SummaryReport from "@/app/components/(tabs)/Progress Monitoring/summary";
import { getUserName, getUserUid } from "../../utils/utils";
import { styled } from "nativewind";
import moment from "moment";

// Card component used in ProgressReport
const Card = ({ children }: { children: ReactNode }) => {
  return (
    <View className="bg-white rounded-lg shadow-md p-4 w-[330px] h-[138px] border border-stone-200">
      {children}
    </View>
  );
};

const StyledView = styled(View);
// Periods: daily, weekly, monthly
type Period = 'daily' | 'weekly' | 'monthly';

// ProgressReport component
const ProgressReport = () => {
  return (
    <View className="items-center -mt-10 mb-6">
      <Card>
        <ThemedText type='subtitle' className='text-black justify-left mb-2'>Progress</ThemedText>
        <ThemedText type='default' className='text-black justify-left mt-1 text-[16px]'>Reduced carbon footprint</ThemedText>

        <View className="mt-1">
          <ProgressBar progress={0.5} color="#4CAF50" style={{
            height: 10,
            borderRadius: 5,
            backgroundColor: '#e0e0e0',
            marginTop: 5,
            width: '100%',
          }} />
        </View>

        <View className="flex-row justify-between mt-2">
          <ThemedText type='defaultSemiBold' className='text-black text-[15px]'>200 g</ThemedText>
          <ThemedText type='defaultSemiBold' className='text-black text-[15px]'>1000 g</ThemedText>
        </View>
      </Card>

      {/* Including Summary Report */}
      {/* <SummaryReport /> */}
    </View>
  );
};

const ReportWithPeriod = () => {
    const [userUid, setUserUid] = useState<string | undefined>();
    const [dataset, setDataset] = useState<any>(null);
    const [period, setPeriod] = useState<Period>('daily'); // State to manage period (daily, weekly, monthly)
  
    useEffect(() => {
      const fetchUserUid = async () => {
        const uid = await getUserUid();
        setUserUid(uid);
      };
  
      fetchUserUid();
    }, []);
  
    // Fetch data based on the selected period
    useEffect(() => {
      const fetchUserData = async () => {
        if (userUid) {
          const userLogs = firestore().collection("user_logs").doc(userUid);
          const currentLog = (await userLogs.get()).data();
  
          if (currentLog) {
            const dates = Object.keys(currentLog).sort();  // Get all the dates and sort them
            
            let data = null;
            if (period === 'daily') {
              data = getDailyData(currentLog, dates);
            } else if (period === 'weekly') {
              data = getWeeklyData(currentLog, dates);
            } else if (period === 'monthly') {
              data = getMonthlyData(currentLog, dates);
            }
            else {
              data = getDailyData(currentLog, dates);
            }
            setDataset(data);
          }
        }
      };
  
      fetchUserData();
    }, [userUid, period]);
  
    // Function to extract daily data
    const getDailyData = (currentLog: any, dates: string[]) => {
      const dailyTotals = dates.map(date => {
        const dailyLogs: Array<number> = Object.values(currentLog[date]);
        return dailyLogs.reduce((total, value) => total + value, 0);
      });
  
      return {
        labels: dates,
        datasets: [{ data: dailyTotals }],
      };
    };
  
    // Function to aggregate weekly data
    const getWeeklyData = (currentLog: any, dates: string[]) => {
      const weeklyData: any = {};
      dates.forEach(date => {
        const week = moment(date).week();
        if (!weeklyData[week]) weeklyData[week] = 0;
        const dailyLogs: Array<number> = Object.values(currentLog[date]);
        weeklyData[week] += dailyLogs.reduce((total, value) => total + value, 0);
      });
  
      const weeks = Object.keys(weeklyData);
      const weeklyTotals = Object.values(weeklyData);
  
      return {
        labels: weeks,
        datasets: [{ data: weeklyTotals }],
      };
    };
  
    // Function to aggregate monthly data
    const getMonthlyData = (currentLog: any, dates: string[]) => {
      const monthlyData: any = {};
      dates.forEach(date => {
        const month = moment(date).format("MMMM YYYY");
        if (!monthlyData[month]) monthlyData[month] = 0;
        const dailyLogs: Array<number> = Object.values(currentLog[date]);
        monthlyData[month] += dailyLogs.reduce((total, value) => total + value, 0);
      });
  
      const months = Object.keys(monthlyData);
      const monthlyTotals = Object.values(monthlyData);
  
      return {
        labels: months,
        datasets: [{ data: monthlyTotals }],
      };
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
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          <TouchableOpacity onPress={() => setPeriod('daily')} style={{ marginRight: 10 }}>
            <Text style={{ color: period === 'daily' ? 'blue' : 'black' }}>Daily</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setPeriod('weekly')} style={{ marginRight: 10 }}>
            <Text style={{ color: period === 'weekly' ? 'blue' : 'black' }}>Weekly</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setPeriod('monthly')}>
            <Text style={{ color: period === 'monthly' ? 'blue' : 'black' }}>Monthly</Text>
          </TouchableOpacity>
        </View>
  
        {/* Chart */}
        <View style={{ paddingBottom: 20 }}>
          <BarChart
            data={dataset}
            width={Dimensions.get("window").width-(Dimensions.get("window").width*0.2)}
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

// Integrated Component
const CombinedReport = () => {
  return (
    <ThemedView className='flex-1 px-2'>

        <SafeAreaView className='flex-1 mt-3'>
          <ScrollView>
            {/* Header */}
            <View className='bg-lime-800 h-1/6 rounded-b-3xl mb-4 justify-center items-center relative'>
              <ThemedText type='subtitle' className='text-[28px] text-gray-100 mb-2'>Analytics Report</ThemedText>
              <ThemedText type='default' className='text-[15px] text-gray-100'>Date</ThemedText>
            </View>

            {/* Progress Report Section */}
            <ProgressReport />

            {/* ReportDaily/Weekly/Monthly Chart Section */}
            <ReportWithPeriod />
          </ScrollView>
        </SafeAreaView>
    </ThemedView>
  );
};

export default CombinedReport;
