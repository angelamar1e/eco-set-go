import React, { createContext, useContext, useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";

// Create User Logs Context
const UserbaseContext = createContext();

// Create Provider Component
export const UserbaseProvider = ({ children }) => {

    const [userCount, setUserCount] = useState(0);

    async function getUserCount() {
        try {
          const usersCollection = firestore().collection('users');
          const countSnapshot = await usersCollection.count().get();
          const userCount = countSnapshot.data().count;
      
          console.log('Total User Count:', userCount);
          return userCount;
        } catch (error) {
          console.error('Error fetching user count:', error);
        }
    }

  return (
    <UserbaseContext.Provider
      value={{
        userLogs,
        loading,
        totalImpact,
        currentFootprint,
        dailyImpact,
        weeklyImpact,
        monthlyImpact,
        stackedChartData,
        handlePeriodChange, // Expose the handler to components that need it
      }}
    >
      {children}
    </UserbaseContext.Provider>
  );
};

// Create a custom hook for easier access
export const useLogsContext = () => {
  return useContext(UserbaseContext);
};
