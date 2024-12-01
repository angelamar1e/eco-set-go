import React, { createContext, useContext, useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { useUserContext } from "./UserContext";
import { convertGramsToTons } from "@/app/utils/EstimationUtils";
import { EmissionsDataContext } from "./EmissionsData";
import { useActionsContext } from "./EcoActions";
import { EmissionsContext } from "./Emissions";

// Create User Logs Context
const UserLogsContext = createContext();

// Create Provider Component
export const UserLogsProvider = ({ children }) => {
  const { userUid, role, initialFootprint, currentFootprint } =
    useUserContext();
  const [userLogs, setUserLogs] = useState({});
  const [loggedActionIds, setLoggedActionIds] = useState([]);
  const {
    foodFootprint,
    transportationFootprint,
    electricityFootprint,
    emissionsData,
  } = useContext(EmissionsContext);
  const [totalImpact, setTotalImpact] = useState(0);
  const {
    foodEcoActions,
    transportationEcoActions,
    electricityEcoActions,
    initializeEcoActions,
  } = useActionsContext();
  const [ecoActionsInitialized, setEcoActionsInitialized] = useState(false); // Track initialization

  // State for impacts
  const [dailyImpact, setDailyImpact] = useState({});
  const [weeklyImpact, setWeeklyImpact] = useState({});
  const [monthlyImpact, setMonthlyImpact] = useState({});

  // Aggregated category states
  const [foodImpact, setFoodImpact] = useState(0);
  const [transportationImpact, setTransportationImpact] = useState(0);
  const [electricityImpact, setElectricityImpact] = useState(0);

  // State for selected time period
  const [selectedPeriod, setSelectedPeriod] = useState("Daily"); // can be "daily", "weekly", or "monthly"

  const [stackedChartData, setStackedChartData] = useState({
    labels: [], // No labels initially
    legend: ["Food", "Transportation", "Electricity"], // Maintain consistent legends
    data: [[0, 0, 0]], // Valid but empty data structure
    barColors: ["#FF6384", "#36A2EB", "#FFCE56"],
  });

  const isChartDataValid = (data) => {
    return (
      data &&
      Array.isArray(data.labels) &&
      data.labels.length > 0 &&
      Array.isArray(data.data) &&
      data.data.length > 0 &&
      data.data.every((entry) => Array.isArray(entry) && entry.length === 3) // Ensure all rows have 3 values
    );
  };

  const [currentLoading, setCurrentLoading] = useState(true);

   // Wait for eco actions to initialize and then set data
   useEffect(() => {
    const initialize = async () => {
      try {
        await initializeEcoActions();
        setEcoActionsInitialized(true); // Mark eco actions as initialized
      } catch (error) {
        console.error("Failed to initialize eco actions:", error);
      }
    };
    initialize();
  }, []); // Runs once on mount

  // Recalculate data whenever userLogs or selectedPeriod changes
  useEffect(() => {
    if (ecoActionsInitialized && userLogs) {
      setData(userLogs);
    }
  }, [userLogs, selectedPeriod, ecoActionsInitialized]);

  const setData = async (userLogs) => {
    if (!ecoActionsInitialized) return; // Ensure initialization is complete

    let totalImpact = 0;
    let foodImpact = 0;
    let transportImpact = 0;
    let electricityImpact = 0;

    const daily = {};
    const weekly = {};
    const monthly = {};

    const loggedActionIds = [];

    if (userLogs) {
      Object.entries(userLogs).forEach(([date, actions]) => {
        const logDate = new Date(date);
        const dayString = logDate.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
        });
        const monthString = logDate.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        const weekString = getWeekString(logDate);

        if (!daily[dayString]) daily[dayString] = { Food: 0, Transportation: 0, Electricity: 0 };
        if (!weekly[weekString]) weekly[weekString] = { Food: 0, Transportation: 0, Electricity: 0 };
        if (!monthly[monthString]) monthly[monthString] = { Food: 0, Transportation: 0, Electricity: 0 };

        Object.entries(actions).forEach(([id, action]) => {
          loggedActionIds.push(id);
          const category = getCategoryFromId(id);

          if (category && typeof action.impact === "number") {
            totalImpact += action.impact;
            daily[dayString][category] += action.impact;
            weekly[weekString][category] += action.impact;
            monthly[monthString][category] += action.impact;
          }
          if (category === "Food") foodImpact += action.impact;
          if (category === "Transportation") transportImpact += action.impact;
          if (category === "Electricity") electricityImpact += action.impact;
        });
      });

      const selectedImpacts =
        selectedPeriod === "Daily"
          ? daily
          : selectedPeriod === "Weekly"
          ? weekly
          : monthly;

      setChartData(selectedImpacts);
    }

    setLoggedActionIds(loggedActionIds);
    setTotalImpact(convertGramsToTons(totalImpact));
    setFoodImpact(convertGramsToTons(foodImpact));
    setTransportationImpact(convertGramsToTons(transportImpact));
    setElectricityImpact(convertGramsToTons(electricityImpact));
    setDailyImpact(daily);
    setWeeklyImpact(weekly);
    setMonthlyImpact(monthly);
  };

  const setChartData = (selectedImpacts) => {
    // Sort entries by date in ascending order
    const sortedEntries = Object.entries(selectedImpacts).sort(
      ([dateA], [dateB]) => new Date(dateA) - new Date(dateB)
    );
  
    // Limit entries based on the selected period
    const limit = selectedPeriod === "Weekly" ? 4 : 5; // Show 4 for weekly, 5 for others
    const limitedEntries = sortedEntries.slice(-limit);
  
    // Extract labels and data
    const limitedLabels = limitedEntries.map(([label]) => label);
  
    const stackedData = limitedEntries.map(([, impacts]) => [
      Number(impacts.Food) || 0,
      Number(impacts.Transportation) || 0,
      Number(impacts.Electricity) || 0,
    ]);
  
    // Set the chart data
    setStackedChartData({
      labels: limitedLabels,
      legend: ["Food", "Transportation", "Electricity"],
      data: stackedData,
      barColors: ["#FF6384", "#36A2EB", "#FFCE56"],
    });
  };
  

  const setCurrentFootprint = async () => {
    setCurrentLoading(true);
    if (initialFootprint && role === "user") {
      const currentOverall = initialFootprint - totalImpact;
      const currentFood = foodFootprint - foodImpact;
      const currentTranspo = transportationFootprint - transportationImpact;
      const currentElectricity = electricityFootprint - electricityImpact;

      await firestore().collection("current_footprint").doc(userUid).set(
        {
          overall_footprint: currentOverall,
          food_footprint: currentFood,
          transportation_footprint: currentTranspo,
          electricity_footprint: currentElectricity,
        },
        { merge: true }
      );
    }
    setCurrentLoading(false);
  };

  useEffect(() => {
    setCurrentFootprint();
  }, [userLogs, initialFootprint]);

  // Helper function to check if userLogs is effectively empty
  const isUserLogsEmpty = (logs) => {
    return Object.values(logs).every((actions) =>
      Object.values(actions).every(
        (action) => !action.impact || action.impact === 0
      )
    );
  };

  const getWeekString = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Sunday as the start of the week
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
  
    const formatOptions = { day: "numeric", month: "short" };
  
    return `${startOfWeek.toLocaleDateString("en-GB", formatOptions)}-${endOfWeek.toLocaleDateString(
      "en-GB",
      formatOptions
    )}`;
  };
  

  // Example function to map action ID to category
  const getCategoryFromId = (id) => {
    if (foodEcoActions.includes(id)) return "Food";
    if (transportationEcoActions.includes(id)) return "Transportation";
    if (electricityEcoActions.includes(id)) return "Electricity";
    console.warn(`Category not found for ID: ${id}`);
    return "Unknown"; // Fallback category
};


  // Function to handle period selection
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  return (
    <UserLogsContext.Provider
      value={{
        currentLoading,
        userLogs,
        setUserLogs,
        setData,
        totalImpact,
        dailyImpact,
        weeklyImpact,
        monthlyImpact,
        stackedChartData,
        loggedActionIds,
        handlePeriodChange, // Expose the handler to components that need it
      }}
    >
      {children}
    </UserLogsContext.Provider>
  );
};

// Create a custom hook for easier access
export const useLogsContext = () => {
  return useContext(UserLogsContext);
};
