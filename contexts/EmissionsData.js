import React, { createContext, useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { useUserContext } from './UserContext';

// Create the context
export const EmissionsDataContext = createContext();

// Provider component
export const EmissionsDataProvider = ({ children }) => {
  const { userUid } = useUserContext();
  const [emissionsData, setEmissionsData] = useState({});
  const [initialData, setInitialData] = useState({});
  const [foodEmissions, setFoodEmissions] = useState(0);
  const [transportationEmissions, setTransportationEmissions] = useState(0);
  const [electricityEmissions, setElectricityEmissions] = useState(0);
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userUid) {
      console.warn("User UID is not available. Cannot fetch emissions data.");
      return;
    }

    console.log("User UID:", userUid);

    const unsubscribeEmissionsData = firestore()
      .collection('emissions_data')
      .doc(userUid)
      .onSnapshot(
        (doc) => {
          if (doc.exists) {
            const data = doc.data();
            setEmissionsData(data);
          } else {
            console.log("Emissions data document not found for user:", userUid);
            setEmissionsData(null);
          }
        },
        (err) => {
          console.error("Error fetching emissions data:", err);
          setError(err);
        }
      );

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeEmissionsData();
    };
  }, [userUid]);

  // Calculate total emissions based on emissions data
  useEffect(() => {
    if (emissionsData) {
      const foodTotal = totalFoodFootprint(emissionsData);
      const transportationTotal = totalTransportationFootprint(emissionsData);
      const electricityTotal = totalElectricityFootprint(emissionsData);
      const overallTotal = foodTotal + transportationTotal + electricityTotal;

      setFoodEmissions(foodTotal);
      setTransportationEmissions(transportationTotal);
      setElectricityEmissions(electricityTotal);
      setTotalEmissions(overallTotal);

      console.log("Emissions Data:", emissionsData);
      console.log("Total Emissions Calculated:", overallTotal);
    } else {
      console.warn("No emissions data available to calculate totals.");
    }
  }, [emissionsData]);

  return (
    <EmissionsDataContext.Provider
      value={{
        emissionsData,
        foodEmissions,
        transportationEmissions,
        electricityEmissions,
        totalEmissions,
        loading,
        error,
      }}
    >
      {children}
    </EmissionsDataContext.Provider>
  );
};

// Emission Calculation Functions
export function totalFoodFootprint(emissionsData) {
  const emissions = ["breakfastEmissions", "coldDrinksEmissions", "hotDrinksEmissions", "mealEmissions", "bottledWaterEmissions"];
  return emissions.reduce((sum, field) => sum + (emissionsData[field] || 0), 0);
}

export function totalTransportationFootprint(emissionsData) {
  const emissions = ["carEmissions", "airTravelEmissions", "efficientTravelEmissions", "publicTransportEmissions", "trainEmissions", "twoWheelersEmissions"];
  return emissions.reduce((sum, field) => sum + (emissionsData[field] || 0), 0);
}

export function totalElectricityFootprint(emissionsData) {
  return emissionsData['electricityEmissions'] || 0;
}
