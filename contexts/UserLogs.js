import React, { createContext, useContext, useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore"; 
import { useUserContext } from "./UserContext";
import { convertGramsToTons } from "@/app/utils/EstimationUtils";
import { EmissionsDataContext } from "./EmissionsData";
import { useActionsContext } from "./EcoActions";

// Create User Logs Context
const UserLogsContext = createContext();

// Create Provider Component
export const UserLogsProvider = ({ children }) => {
  const { userUid } = useUserContext();
  const currentFootprintDoc = firestore().collection('current_footprint').doc(userUid);
  const [userLogs, setUserLogs] = useState({});
  const { totalEmissions } = useContext(EmissionsDataContext);
  const [totalImpact, setTotalImpact] = useState(0);
  const [currentFootprint, setCurrentFootprint] = useState(0);
  const { foodEcoActions, transportationEcoActions, electricityEcoActions } = useActionsContext();
  const [loading, setLoading] = useState(true);

  // State for impacts
  const [dailyImpact, setDailyImpact] = useState({});
  const [weeklyImpact, setWeeklyImpact] = useState({});
  const [monthlyImpact, setMonthlyImpact] = useState({});
  
  // State for selected time period
  const [selectedPeriod, setSelectedPeriod] = useState("Daily"); // can be "daily", "weekly", or "monthly"

  // Stacked chart data
  const [stackedChartData, setStackedChartData] = useState({
    labels: [],
    legend: ["Food", "Transportation", "Electricity"], // Adjust based on your categories
    data: [],
    barColors: ["#FF6384", "#36A2EB", "#FFCE56"],
  });

  // Fetch user logs from Firestore
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('user_logs')
      .doc(userUid)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data();
          setUserLogs(data || {}); // Ensure we set an empty object if data is undefined
        } else {
          setUserLogs({});
        }
        setLoading(false);
      }, () => setLoading(false));
    
    return () => unsubscribe();
  }, [userUid]);

  // Calculate total impact and prepare chart data
  useEffect(() => {
    let totalImpact = 0;
    
    const daily = {};
    const weekly = {};
    const monthly = {};
    
    // Initialize stacked data array
    const stackedData = [];

    if (userLogs && Object.keys(userLogs).length > 0) {
      Object.entries(userLogs).forEach(([date, actions]) => {
        const logDate = new Date(date);
        const dayString = logDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        const monthString = logDate.toLocaleString('default', { month: 'short', year: 'numeric' });
        const weekString = getWeekString(logDate);

        if (!daily[dayString]) daily[dayString] = { Food: 0, Transportation: 0, Electricity: 0 };
        if (!weekly[weekString]) weekly[weekString] = { Food: 0, Transportation: 0, Electricity: 0 };
        if (!monthly[monthString]) monthly[monthString] = { Food: 0, Transportation: 0, Electricity: 0 };

        Object.entries(actions).forEach(([id, action]) => {
          const category = getCategoryFromId(id); // Define this function based on your action structure
          if (category && typeof action.impact === 'number') {
            totalImpact += action.impact;
            daily[dayString][category] += action.impact;
            weekly[weekString][category] += action.impact;
            monthly[monthString][category] += action.impact;
          }
        });
      });

      // Convert impacts based on selected period for stacked chart data
      const selectedImpacts = selectedPeriod === "Daily" ? daily : selectedPeriod === "Weekly" ? weekly : selectedPeriod === "Monthly" ? monthly : daily;

      Object.entries(selectedImpacts).forEach(([label, impacts]) => {
        stackedData.push([impacts.Food, impacts.Transportation, impacts.Electricity]);
      });

      // Update chart data
      setStackedChartData(prevData => ({
        ...prevData,
        labels: Object.keys(selectedImpacts),
        data: stackedData,
      }));
    }

    setTotalImpact(convertGramsToTons(totalImpact));
    setCurrentFootprint(totalEmissions - convertGramsToTons(totalImpact));
    setDailyImpact(daily);
    setWeeklyImpact(weekly);
    setMonthlyImpact(monthly);

  }, [userLogs, selectedPeriod]); // Include selectedPeriod as a dependency

  // Get week string for weekly impacts
  const getWeekString = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Sunday as the start of the week
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return `${startOfWeek.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - ${endOfWeek.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
  };

  // Example function to map action ID to category
  const getCategoryFromId = (id) => {
    if (foodEcoActions.includes(id)) return 'Food';
    if (transportationEcoActions.includes(id)) return 'Transportation';
    if (electricityEcoActions.includes(id)) return 'Electricity';
    return null;
  };

  // Function to handle period selection
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  return (
    <UserLogsContext.Provider value={{
      userLogs,
      loading,
      totalImpact,
      currentFootprint,
      dailyImpact,
      weeklyImpact,
      monthlyImpact,
      stackedChartData,
      handlePeriodChange, // Expose the handler to components that need it
    }}>
      {children}
    </UserLogsContext.Provider>
  );
};

// Create a custom hook for easier access
export const useLogsContext = () => {
  return useContext(UserLogsContext);
};
