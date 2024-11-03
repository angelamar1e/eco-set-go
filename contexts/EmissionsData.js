import React, { createContext, useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { getUserUid } from '@/app/utils/utils';
import { useUserContext } from './UserContext';

// Create the context
export const EmissionsDataContext = createContext();

// Provider component
export const EmissionsDataProvider = ({ children }) => {
  const {userUid} = useUserContext();
  const [emissionsData, setEmissionsData] = useState({});
  const [initialData, setInitialData] = useState({});
  const [foodEmissions, setFoodEmissions] = useState(0);
  const [transportationEmissions, setTransportationEmissions] = useState(0);
  const [electricityEmissions, setElectricityEmissions] = useState(0);
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeEmissionsData = async () => {
      try {
        const unsubscribe = firestore()
          .collection('emissions_data')
          .doc(userUid)
          .onSnapshot((doc) => {
            if (doc.exists) {
              const data = doc.data();
              setEmissionsData(data);
            } else {
              setEmissionsData(null);
            }
            setLoading(false);
          }, (error) => {
            setError(error);
            setLoading(false);
          });

        // Cleanup subscription on unmount
        return () => unsubscribe();
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    const initializeInitialData = async () => {
      try {
        const unsubscribe = firestore()
          .collection('initial_footprint')
          .doc(userUid)
          .onSnapshot((doc) => {
            if (doc.exists) {
              const data = doc.data();
              setInitialData(data);
            } else {
              setInitialData(null);
            }
            setLoading(false);
          }, (error) => {
            setError(error);
            setLoading(false);
          });

        // Cleanup subscription on unmount
        return () => unsubscribe();
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    initializeEmissionsData();
    initializeInitialData();
  }, [userUid]);

  // Update emissions totals whenever emissionsData changes
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
    }
  }, [emissionsData]);

  return (
    <EmissionsDataContext.Provider value={{
      emissionsData,
      foodEmissions,
      transportationEmissions,
      electricityEmissions,
      totalEmissions,
      loading,
      error
    }}>
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

// Function to get the highest emissions per category and their sources
export function getHighestEmissions(emissionsData) {
  const categories = {
    food: [
      { field: "breakfastEmissions", label: "Breakfast 🍴" },
      { field: "coldDrinksEmissions", label: "Cold Drinks 🍹" },
      { field: "hotDrinksEmissions", label: "Hot Drinks ☕" },
      { field: "mealEmissions", label: "Meals 🍽️" },
      { field: "bottledWaterEmissions", label: "Bottled Water 💧" },
      { field: "beefMealEF", label: "Beef Meal 🥩" },
      { field: "chickenMealEF", label: "Chicken Meal 🍗" },
      { field: "fishMealEF", label: "Fish Meal 🐟" },
      { field: "porkMealEF", label: "Pork Meal 🥓" },
      { field: "veganMealEF", label: "Vegan Meal 🥦" },
      { field: "vegetarianMealEF", label: "Vegetarian Meal 🥦" },
      { field: "simpleBreakfastEF", label: "Simple Breakfast 🍳" },
      { field: "traditionalBreakfastEF", label: "Traditional Breakfast 🍳" },
      { field: "cerealsBreakfastEF", label: "Cereals Breakfast 🥣" },
      { field: "fruitsBreakfastEF", label: "Fruits Breakfast 🍎" },
      { field: "breadBreakfastEF", label: "Bread Breakfast 🍞" },
      { field: "coffeeEmissions", label: "Coffee ☕" },
      { field: "alcoholFrequency", label: "Alcohol Frequency 🍻" },
    ],
    transportation: [
      { field: "carEmissions", label: "Car 🚘" },
      { field: "airTravelEmissions", label: "Air Travel ✈️" },
      { field: "efficientTravelEmissions", label: "Efficient Travel 🚲" },
      { field: "publicTransportEmissions", label: "Public Transport 🚌" },
      { field: "trainEmissions", label: "Train 🚆" },
      { field: "twoWheelersEmissions", label: "Two Wheelers 🛵" },
    ],
    electricity: [
      { field: "electricityEmissions", label: "Electricity ⚡" },
    ],
  };

  const highestEmissions = {
    food: { value: 0, source: '', percentage: 0 },
    transportation: { value: 0, source: '', percentage: 0 }, 
    electricity: { value: 0, source: '', percentage: 0 }, 
};


  // Calculate highest emissions in each category
  for (const [category, fields] of Object.entries(categories)) {
    fields.forEach(({ field, label }) => {
      const value = emissionsData[field] || 0; // Default to 0 if the field doesn't exist
      if (value > highestEmissions[category].value) {
        highestEmissions[category].value = value;
        highestEmissions[category].source = label; 
      }
    });
  }

  return highestEmissions;
}