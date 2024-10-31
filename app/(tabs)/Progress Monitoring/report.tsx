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
import { styled } from "nativewind";
import moment from "moment";
import { stringify } from "postcss";
import { useUserContext } from "@/contexts/UserContext";

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
type Category = 'All' | 'Food' | 'Transportation' | 'Electricity';

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
    const {userUid} = useUserContext();
    const [dataset, setDataset] = useState<any>(null);
    const [period, setPeriod] = useState<Period>('daily'); // State to manage period (daily, weekly, monthly)
    const [category, setCategory] = useState<Category>('All');
  
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
    const getEmissionsData = async (currentLog: Map<string, Map<string, number>>, 
      date_range: string = "daily", category: string = 'All') => {
        const emissionData: any = {};
        console.log("Processing");
        const filteredLog = await getCategoricalData(currentLog, category);
        const dates = Array.from(filteredLog.keys()).sort(); // Get all the dates and sort them
        dates.forEach(date => {
          const currDate = getDateFormat(date, date_range);
          // Initialize emission date range to 0 if it does not exist
          if (!emissionData[currDate]) {emissionData[currDate] = 0; }
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
          datasets: [{data: emissionTotal}]
        }
    };

    // Get Date format assuming that the string date is of a date format
    const getDateFormat = (date: string, date_range: string) => {
      switch(date_range) {
        case 'daily':
          return date;
        case 'weekly':
          return moment(date).week();
        case 'monthly':
          return moment(date).format("MMMM YYYY");
        case 'yearly':
          return moment(date).format("YYYY");
        default:
          throw new Error("Date Range does not accept this string");
      }
    }

    // Returns the valid logs with the specified category.
    // Category can only be "All", "Transportation", "Food", or "Electricity"
    const getCategoricalData = async (currentLog: Map<string, Map<string, number>>, category: string) => {
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
          const eco_action = firestore().collection('eco_actions').doc(key);
          const action = (await eco_action.get()).data();

          if (action && action['category'] === category) {
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

        {/* Category Switcher */}
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          <TouchableOpacity onPress={() => setCategory('All')} style={{ marginRight: 10 }}>
            <Text style={{ color: category === 'All' ? 'blue' : 'white' }}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCategory('Food')} style={{ marginRight: 10 }}>
            <Text style={{ color: category === 'Food' ? 'blue' : 'white' }}>Food</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCategory('Transportation')}>
            <Text style={{ color: category === 'Transportation' ? 'blue' : 'white' }}>Transportation</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCategory('Electricity')}>
            <Text style={{ color: category === 'Electricity' ? 'blue' : 'white' }}>Electricity</Text>
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
