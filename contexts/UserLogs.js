import React, { createContext, useContext, useEffect, useState } from "react";
import auth from "@react-native-firebase/auth"; // Firebase Auth
import firestore from "@react-native-firebase/firestore"; // Firebase Firestore
import { useUserContext } from "./UserContext";
import { UserLogs } from "@/types/UserLogs";

// Create a User logs Context
const UserLogsContext = createContext();

// Create a Provider Component
export const UserLogsProvider = ({ children }) => {
  const { userUid } = useUserContext();
  const [userLogs, setUserLogs] = useState({});
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
              setUserLogs(null);
              console.log('NO RECORD');
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

    initializeData();
    console.log(userLogs);
  }, [userUid]);

  return (
    <UserLogsContext.Provider value={{ userLogs, loading }}>
        {children}
    </UserLogsContext.Provider>
);
};

// Create a custom hook for easier access
export const useLogsContext = () => {
    return useContext(UserLogsContext);
};