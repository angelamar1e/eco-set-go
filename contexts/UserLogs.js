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
    initializeData,
  } = useActionsContext();

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

  const [currentLoading, setCurrentLoading] = useState(false);

  useEffect(() => {
    initializeData();
    setData(userLogs);
  }, [userLogs, selectedPeriod]);

  // Calculate total impact and prepare chart data
  const setData = (userLogs) => {
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

        if (!daily[dayString])
          daily[dayString] = { Food: 0, Transportation: 0, Electricity: 0 };
        if (!weekly[weekString])
          weekly[weekString] = { Food: 0, Transportation: 0, Electricity: 0 };
        if (!monthly[monthString])
          monthly[monthString] = { Food: 0, Transportation: 0, Electricity: 0 };

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
    const limitedEntries = Object.entries(selectedImpacts)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .slice(-5);

    const limitedLabels = limitedEntries.map(([label]) => label);

    const stackedData = limitedEntries.map(([, impacts]) => [
      Number(impacts.Food) || 0,
      Number(impacts.Transportation) || 0,
      Number(impacts.Electricity) || 0,
    ]);

    setStackedChartData({
      labels: limitedLabels,
      legend: ["Food", "Transportation", "Electricity"],
      data: stackedData,
      barColors: ["#FF6384", "#36A2EB", "#FFCE56"],
    });
  };

  const setCurrentFootprint = () => {
    setCurrentLoading(true);
    if (initialFootprint && role === "user") {
      const currentOverall = initialFootprint - totalImpact;
      const currentFood = foodFootprint - foodImpact;
      const currentTranspo = transportationFootprint - transportationImpact;
      const currentElectricity = electricityFootprint - electricityImpact;

      firestore().collection("current_footprint").doc(userUid).set(
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
  
    return `${startOfWeek.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
    })} - ${endOfWeek.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
    })}`;
  };
  

  // Example function to map action ID to category
  const getCategoryFromId = (id) => {
    if (foodEcoActions.includes(id)) return "Food";
    if (transportationEcoActions.includes(id)) return "Transportation";
    if (electricityEcoActions.includes(id)) return "Electricity";
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
