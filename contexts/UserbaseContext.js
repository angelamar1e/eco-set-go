import React, { createContext, useContext, useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { useActionsContext } from "./EcoActions";
import {
  conditionalConvertGramsToKg,
  convertGramsToKg,
  convertGramsToTons,
} from "@/app/utils/EstimationUtils";
import { useUserContext } from "./UserContext";

// Create User Logs Context
const UserbaseContext = createContext();

// Create Provider Component
export const UserbaseProvider = ({ children }) => {
  const { userUid } = useUserContext();
  const { foodEcoActions, transportationEcoActions, electricityEcoActions } =
    useActionsContext();
  const [userCount, setUserCount] = useState(0);
  const usersCollection = firestore().collection("users");
  const dailyLogCollection = firestore().collection("daily_log");

  const [totalImpact, setTotalImpact] = useState(totalImpact);
  const [impactAverage, setImpactAverage] = useState(impactAverage);
  const [dailyAverage, setDailyAverage] = useState(dailyAverage);
  const [weeklyAverage, setWeeklyAverage] = useState(weeklyAverage);
  const [monthlyAverage, setMonthlyAverage] = useState(monthlyAverage);
  const [pieChartData, setPieChartData] = useState([]);

  const [categoryRankings, setCategoryRankings] = useState([]);
  const [mostPreferredActions, setMostPreferredActions] = useState({});
  const [loading, setLoading] = useState(true); // Track loading state

  const [averageCurrentEmissions, setAverageCurrentEmissions] = useState({
    overall: 0,
    electricity: 0,
    food: 0,
    transportation: 0,
  });

  const [averageInitialEmissions, setAverageInitialEmissions] = useState({
    overall: 0,
    electricity: 0,
    food: 0,
    transportation: 0,
  });

  const [userCountLoading, setUserCountLoading] = useState(true);
  const [emissionLoading, setEmissionLoading] = useState(true);
  const [dailyLogLoading, setDailyLogLoading] = useState(true);
  const [loadingCurrent, setLoadingCurrent] = useState(true);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // function to map action ID to category
  const getCategoryFromId = (id) => {
    if (foodEcoActions.includes(id)) return "Food";
    if (transportationEcoActions.includes(id)) return "Transportation";
    if (electricityEcoActions.includes(id)) return "Electricity";
    return null;
  };

  // User count
  useEffect(() => {
    const fetchUserCount = async () => {
      setUserCountLoading(true); // Start loading
      try {
        const snapshot = await usersCollection.get();
        const userCount = snapshot.size; // Count documents
        setUserCount(userCount ? userCount - 1 : 0);
      } catch (error) {
        console.error("Error fetching user count:", error);
      } finally {
        setUserCountLoading(false); // Stop loading
      }
    };

    fetchUserCount();
  }, [userUid]);

  // Emission reductions, totals, and averages
  const fetchEmissionData = async () => {
    setEmissionLoading(true);
    try {
      const snapshot = await firestore().collection("user_logs").get();
      if (snapshot.empty) {
        console.log("No logs found in user_logs collection.");
      }

      let totalImpact = 0;
      let foodImpact = 0;
      let transportImpact = 0;
      let electricityImpact = 0;

      const allDates = new Set();
      const weeklyTotals = {};
      const monthlyTotals = {};

      if (loading) {
        snapshot.forEach((doc) => {
          const userLogs = doc.data();
          if (userLogs) {
            Object.entries(userLogs).forEach(([date, actions]) => {
              const logDate = new Date(date);
              const dayString = logDate.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              });
              const weekString = `${logDate.getFullYear()}-W${Math.ceil(
                logDate.getDate() / 7
              )}`;
              const monthString = logDate.toLocaleDateString("en-GB", {
                month: "short",
                year: "numeric",
              });

              allDates.add(dayString);

              if (!weeklyTotals[weekString]) weeklyTotals[weekString] = 0;
              if (!monthlyTotals[monthString]) monthlyTotals[monthString] = 0;

              Object.entries(actions).forEach(([id, action]) => {
                const category = getCategoryFromId(id);
                if (category && action.impact) {
                  totalImpact += action.impact;

                  weeklyTotals[weekString] += action.impact;
                  monthlyTotals[monthString] += action.impact;

                  if (category === "Food") foodImpact += action.impact;
                  if (category === "Transportation")
                    transportImpact += action.impact;
                  if (category === "Electricity")
                    electricityImpact += action.impact;
                }
              });
            });
          }
        });

        const totalDays = allDates.size;
        const totalWeeks = Object.keys(weeklyTotals).length;
        const totalMonths = Object.keys(monthlyTotals).length;

        const average = totalImpact / userCount;
        const dailyAverage = totalDays > 0 ? totalImpact / totalDays : 0;
        const weeklyAverage = totalWeeks > 0 ? totalImpact / totalWeeks : 0;
        const monthlyAverage = totalMonths > 0 ? totalImpact / totalMonths : 0;

        const chartData = [
          {
            name: "Food",
            value: convertGramsToKg(foodImpact),
            color: "#FF6384",
            legendFontColor: "#7F7F7F",
            legendFontSize: 12,
          },
          {
            name: "Transportation",
            value: convertGramsToKg(transportImpact),
            color: "#36A2EB",
            legendFontColor: "#7F7F7F",
            legendFontSize: 12,
          },
          {
            name: "Electricity",
            value: convertGramsToKg(electricityImpact),
            color: "#FFCE56",
            legendFontColor: "#7F7F7F",
            legendFontSize: 12,
          },
        ];

        setTotalImpact(convertGramsToKg(totalImpact));
        setPieChartData(chartData);
        setImpactAverage(convertGramsToKg(average));
        setDailyAverage(convertGramsToKg(dailyAverage));
        setWeeklyAverage(convertGramsToKg(weeklyAverage));
        setMonthlyAverage(convertGramsToKg(monthlyAverage));
      }
    } catch (error) {
      console.error("Error fetching user logs:", error);
    } finally {
      setEmissionLoading(false);
    }
  };

  // Daily log actions
  const fetchDailyLogActions = async () => {
    setDailyLogLoading(true);
    try {
      const snapshot = await firestore().collection("daily_logs").get();

      if (snapshot.empty) {
        console.log("No logs found in daily_logs collection.");
      }

      const actionCountsByCategory = {};
      const actionCounts = {};
      const allActions = [];

      if (loading) {
        snapshot.forEach((doc) => {
          const dailyLog = doc.data();
          if (dailyLog.action_ids && Array.isArray(dailyLog.action_ids)) {
            allActions.push(...dailyLog.action_ids);
          }
        });

        if (allActions.length === 0) {
          setCategoryRankings([]);
          setMostPreferredActions({});
          return;
        }

        allActions.forEach((actionId) => {
          actionCounts[actionId] = (actionCounts[actionId] || 0) + 1;
          const category = getCategoryFromId(actionId);
          if (category) {
            if (!actionCountsByCategory[category]) {
              actionCountsByCategory[category] = { total: 0, actions: {} };
            }
            actionCountsByCategory[category].total++;
            actionCountsByCategory[category].actions[actionId] =
              (actionCountsByCategory[category].actions[actionId] || 0) + 1;
          }
        });

        const rankedCategories = Object.entries(actionCountsByCategory)
          .sort(([, a], [, b]) => b.total - a.total)
          .map(([category, data]) => ({
            category,
            totalActions: data.total,
            mostPreferredAction: Object.entries(data.actions).reduce(
              (max, [id, count]) => (count > max.count ? { id, count } : max),
              { id: null, count: 0 }
            ),
          }));

        setCategoryRankings(rankedCategories);
        setMostPreferredActions(
          rankedCategories.reduce(
            (acc, { category, mostPreferredAction }) => ({
              ...acc,
              [category]: mostPreferredAction,
            }),
            {}
          )
        );
      }
    } catch (error) {
      console.error("Error fetching daily log actions:", error);
    } finally {
      setDailyLogLoading(false);
    }
  };

  const fetchCurrentEmissions = async () => {
    setLoadingCurrent(true);
    try {
      const snapshot = await firestore().collection("current_footprint").get();
      let totalOverall = 0,
        totalElectricity = 0,
        totalFood = 0,
        totalTransportation = 0;
      let count = 0;

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        totalOverall += data.overall_footprint || 0;
        totalElectricity += data.electricity_footprint || 0;
        totalFood += data.food_footprint || 0;
        totalTransportation += data.transportation_footprint || 0;
        count++;
      });

      if (count > 0) {
        setAverageCurrentEmissions({
          overall: totalOverall / count,
          electricity: totalElectricity / count,
          food: totalFood / count,
          transportation: totalTransportation / count,
        });
      } else {
        setAverageCurrentEmissions({
          overall: 0,
          electricity: 0,
          food: 0,
          transportation: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching current emissions data:", error);
    } finally {
      setLoadingCurrent(false);
    }
  };

  const fetchInitialEmissions = async () => {
    setLoadingInitial(true);
    try {
      const snapshot = await firestore().collection("initial_footprint").get();
      let totalOverall = 0,
        totalElectricity = 0,
        totalFood = 0,
        totalTransportation = 0;

      let count = 0;

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        totalOverall += data.overall_footprint || 0;
        totalElectricity += data.electricity_footprint || 0;
        totalFood += data.food_footprint || 0;
        totalTransportation += data.transportation_footprint || 0;
        count++;
      });

      if (count > 0) {
        setAverageInitialEmissions({
          overall: totalOverall / count,
          electricity: totalElectricity / count,
          food: totalFood / count,
          transportation: totalTransportation / count,
        });
      } else {
        setAverageInitialEmissions({
          overall: 0,
          electricity: 0,
          food: 0,
          transportation: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching initial emissions data:", error);
    } finally {
      setLoadingInitial(false);
    }
  };

  useEffect(() => {
    fetchEmissionData();
    fetchDailyLogActions();
    fetchCurrentEmissions();
    fetchInitialEmissions();
  }, [userUid]);

  return (
    <UserbaseContext.Provider
      value={{
        totalImpact,
        pieChartData,
        impactAverage,
        dailyAverage,
        weeklyAverage,
        monthlyAverage,
        averageCurrentEmissions,
        averageInitialEmissions,
        categoryRankings,
        mostPreferredActions,
        emissionLoading,
        dailyLogLoading,
        loadingCurrent,
        loadingInitial, // Expose loading state
      }}
    >
      {children}
    </UserbaseContext.Provider>
  );
};

// Create a custom hook for easier access
export const useUserbaseContext = () => {
  return useContext(UserbaseContext);
};
