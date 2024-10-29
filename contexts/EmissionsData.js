import React, { createContext, useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { useUserContext } from './UserContext';

// Create the context
export const EmissionsDataContext = createContext();

// Provider component
export const EmissionsDataProvider = ({ children }) => {
  const [emissionsData, setEmissionsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {userUid} = useUserContext();

  useEffect(() => {
    const initializeData = async () => {
      try {
        const unsubscribe = firestore()
          .collection('emissions_data')
          .doc(userUid) // Use the uid obtained from getUserUid
          .onSnapshot((doc) => {
            if (doc.exists) {
              setEmissionsData(doc.data());
            } else {
              setEmissionsData(null);
            }
            setLoading(false); // Set loading to false after data fetch
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

    initializeData();
  }, [userUid]); // Empty dependency array to run only once on mount

  return (
    <EmissionsDataContext.Provider value={{ emissionsData, loading, error }}>
      {children}
    </EmissionsDataContext.Provider>
  );
};
