import React, { createContext, useContext, useEffect, useState } from "react";
import auth from "@react-native-firebase/auth"; // Firebase Auth
import firestore from "@react-native-firebase/firestore"; // Firebase Firestore
import { useUserContext } from "./UserContext";
import { UserLogs } from "@/types/UserLogs";
import { convertGramsToKg, convertGramsToTons, convertKgToTons } from "@/app/utils/EstimationUtils";
import { EmissionsDataContext } from "./EmissionsData";
import { useActionsContext } from "./EcoActions";

// Create a User logs Context
const UserLogsContext = createContext();

// Create a Provider Component
export const UserLogsProvider = React.FC = ({ children }) => {
  const { userUid } = useUserContext();
  const currentFootprintDoc = firestore().collection('current_footprint').doc(userUid);
  const [userLogs, setUserLogs] = useState({});
  const { totalEmissions } = useContext(EmissionsDataContext); // total emissions from quiz
  const [totalImpact, setTotalImpact] = useState(0);
  const [totalFoodImpact, setTotalFoodImpact] = useState(0);
  const [totalTransportImpact, setTotalTransportImpact] = useState(0);
  const [totalElectricityImpact, setTotalElectricityImpact] = useState(0);
  const [currentFootprint, setCurrentFootprint] = useState(0);
  const { foodEcoActions, transportationEcoActions, electricityEcoActions } = useActionsContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const unsubscribe = firestore()
          .collection('user_logs')
          .doc(userUid)
          .onSnapshot((doc) => {
            if (doc.exists) {
              const data = doc.data();
              setUserLogs(data);
              console.log(userLogs);
            } else {
              setUserLogs({});
            }
            setLoading(false);
          }, (error) => {
            setLoading(false);
          });

        // Cleanup subscription on unmount
        return () => unsubscribe();
      } catch (error) {
        setLoading(false);
      }
    };

    initializeData();
    console.log(userLogs);
  }, [userUid]);
  
  useEffect(() => {
    let totalImpact = 0;

    if (userLogs) {
      Object.entries(userLogs).forEach(([date, actions]) => {
        for (const logEntry of Object.values(actions)) {
          if (typeof logEntry.impact === "number") {
            totalImpact += logEntry.impact; // Sum the impacts directly
          }
        }
      });
    }

    setTotalImpact(convertGramsToTons(totalImpact));
  }, [userLogs]);

  useEffect(() => {
    let currentFootprint;

    if (totalEmissions, totalImpact){
      currentFootprint = totalEmissions - totalImpact;

      currentFootprintDoc.set({
        current_footprint: currentFootprint
      }, {merge: true});

      setCurrentFootprint(currentFootprint);
    }
  }, [userLogs, totalEmissions, totalImpact]);

  const [selectedCategory, setSelectedCategory] = useState('food'); // Default to 'food'
  const [dailyImpact, setDailyImpact] = useState({});
  const [weeklyImpact, setWeeklyImpact] = useState({});
  const [monthlyImpact, setMonthlyImpact] = useState({});

  useEffect(() => {
      if (!userLogs) return;

      let ecoActions;
      switch (selectedCategory) {
          case 'electricity':
              ecoActions = electricityEcoActions;
              break;
          case 'transportation':
              ecoActions = transportationEcoActions;
              break;
          case 'food':
          default:
              ecoActions = foodEcoActions;
              break;
      }

      const dailyImpact = {};
      const weeklyImpact = {};
      const monthlyImpact = {};

      Object.entries(userLogs).forEach(([date, actions]) => {
          const logDate = new Date(date);
          let logImpact = 0;

          // Calculate total impact for the selected category on this date
          Object.entries(actions).forEach(([id, action]) => {
            console.log("ID:", id, action);
            console.log("ECO ACTIONS: ",ecoActions);
              if (ecoActions.includes(id)) {
                  logImpact += action.impact;
              }
          });

          // Format daily impact key
          const dayString = logDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
          dailyImpact[dayString] = (dailyImpact[dayString] || 0) + logImpact;

          // Format weekly impact key as range (start of week to end of week)
          const startOfWeek = getStartOfWeek(logDate);
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          const weekRange = `${startOfWeek.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
          weeklyImpact[weekRange] = (weeklyImpact[weekRange] || 0) + logImpact;

          // Format monthly impact key as "Month Year"
          const monthString = logDate.toLocaleString('default', { month: 'long', year: 'numeric' });
          monthlyImpact[monthString] = (monthlyImpact[monthString] || 0) + logImpact;
      });

      // Convert to tons and set state
      setDailyImpact(dailyImpact);
      setWeeklyImpact(weeklyImpact);
      setMonthlyImpact(monthlyImpact);

  }, [userLogs, selectedCategory]); 

  // Function to handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

// Helper functions
const getStartOfWeek = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Assuming Sunday as the start of the week
    return startOfWeek;
};

  return (
    <UserLogsContext.Provider value={{ userLogs, loading, totalImpact, currentFootprint, dailyImpact, weeklyImpact, monthlyImpact, handleCategoryChange }}>
        {children}
    </UserLogsContext.Provider>
);
};

// Create a custom hook for easier access
export const useLogsContext = () => {
    return useContext(UserLogsContext);
};