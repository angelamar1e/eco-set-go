import React, { createContext, useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { useUserContext } from './UserContext';

// Create the context
export const EmissionsDataContext = createContext();

// Provider component
export const EmissionsDataProvider = ({ children }) => {
  const { userUid } = useUserContext();
  const [initialData, setInitialData] = useState({});
  const [foodEmissions, setFoodEmissions] = useState(0);
  const [transportationEmissions, setTransportationEmissions] = useState(0);
  const [electricityEmissions, setElectricityEmissions] = useState(0);
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  return (
    <EmissionsDataContext.Provider
      value={{
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

// Function to get the highest emissions per category and their sources
export function getHighestEmissions(emissionsData) {
  const highestEmissions = {
    food: { value: 0, source: '', percentage: 0 },
    transportation: { value: 0, source: '', percentage: 0 },
    electricity: { value: 0, source: '', percentage: 0 },
  };

  // Food category breakdown
  const foodCategories = {
    meals: [
      { field: "beefMealEF", frequency: "Beef", label: "Beef Meals 🥩" },
      { field: "chickenMealEF", frequency: "Chicken", label: "Chicken Meals 🍗" },
      { field: "porkMealEF", frequency: "Pork", label: "Pork Meals 🥓" },
      { field: "fishMealEF", frequency: "Fish", label: "Fish Meals 🐟" },
      { field: "vegetarianMealEF", frequency: "Vegetarian", label: "Vegetarian Meals 🥗" },
      { field: "veganMealEF", frequency: "Vegan", label: "Vegan Meals 🥬" }
    ],
    breakfast: [
      { field: "breakfastEmissions", label: "Breakfast 🍳" }
    ],
    drinks: [
      { field: "coldDrinksEmissions", label: "Cold Drinks 🥤" },
      { field: "hotDrinksEmissions", label: "Hot Drinks ☕" },
      { field: "bottledWaterEmissions", label: "Bottled Water 💧" }
    ]
  };

  // Transportation category
  const transportationSources = [
    { field: "carEmissions", label: "Car 🚘" },
    { field: "airTravelEmissions", label: "Air Travel ✈️" },
    { field: "efficientTravelEmissions", label: "Efficient Travel 🚲" },
    { field: "publicTransportEmissions", label: "Public Transport 🚌" },
    { field: "trainEmissions", label: "Train 🚆" },
    { field: "twoWheelersEmissions", label: "Two Wheelers 🛵" }
  ];

  // Electricity category
  const electricitySources = [
    { field: "electricityEmissions", label: "Electricity ⚡" }
  ];

  // Helper function to find highest emission in a category
  const findHighestInCategory = (sources) => {
    let highest = { value: 0, source: '' };
    sources.forEach(({ field, label }) => {
      const value = Number(emissionsData[field]) || 0;
      if (value > highest.value) {
        highest = { value, source: label };
      }
    });
    return highest;
  };

  // Special handling for meals to consider frequency
  const findHighestMealEmission = () => {
    let highest = { value: 0, source: '' };
    foodCategories.meals.forEach(({ field, frequency, label }) => {
      // Only consider meals that the user actually consumes
      if (emissionsData.mealTypeFrequency && emissionsData.mealTypeFrequency[frequency] > 0) {
        const ef = Number(emissionsData[field]) || 0;
        const frequency = Number(emissionsData.mealTypeFrequency[frequency]) || 0;
        const value = ef * frequency;
        if (value > highest.value) {
          highest = { value, source: label };
        }
      }
    });
    return highest;
  };

  // Find highest emissions for food category
  const highestMeal = findHighestMealEmission();
  const highestBreakfast = findHighestInCategory(foodCategories.breakfast);
  const highestDrink = findHighestInCategory(foodCategories.drinks);

  // Set the highest food emission
  highestEmissions.food = [highestMeal, highestBreakfast, highestDrink]
    .reduce((highest, current) => current.value > highest.value ? current : highest);

  // Find highest emissions for transportation and electricity
  highestEmissions.transportation = findHighestInCategory(transportationSources);
  highestEmissions.electricity = findHighestInCategory(electricitySources);

  return highestEmissions;
}