import React, { createContext, useContext, useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth'; // Firebase Auth
import firestore from '@react-native-firebase/firestore'; // Firebase Firestore
import { router } from 'expo-router';
import { goToInterface } from '@/app/utils/utils';
import moment from 'moment';

// Create a User Context
const UserContext = createContext();

// Create a Provider Component
export const UserProvider = ({ children }) => {
  const [userUid, setUserUID] = useState();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [currentFootprint, setCurrentFootprint] = useState(0);
  const [initialFootprint, setInitialFootprint] = useState(0);
  const [loading, setLoading] = useState(true);
  const [joinDate, setJoinDate] = useState('');

  // Function to fetch user details
  const fetchUserDetails = async (uid) => {
    setLoading(true); // Set loading to true at the beginning
    try {
      // Fetch user document from Firestore once
      const userDoc = await firestore().collection("users").doc(uid).get();

      if (userDoc.exists) {
        const { username, role, created_at } = userDoc.data(); // Destructure username and role from the fetched document

        // Set individual user details states
        setUserUID(uid);
        setUsername(username || ""); // Fallback to an empty string if undefined
        setRole(role || ""); // Fallback to an empty string if undefined
        
        if (created_at) {
          const parsedDate = moment(created_at, "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ").format("YYYY-MM-DD");
          setJoinDate(parsedDate); // Should now display as "YYYY-MM-DD"
      } else {
          setJoinDate('');
      }
  } else {
        console.log("User document does not exist");
        resetUserDetails(uid);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      // Optionally reset to defaults on error
      resetUserDetails(null);
    } finally {
      setLoading(false); // Set loading to false after the operation
    }
  };

  useEffect(() => {
    // Only set up listeners if userUid is available
    if (!userUid) return;
  
    // Set up listeners for both footprints
    const unsubscribeInitial = firestore()
      .collection("initial_footprint")
      .doc(userUid)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data();
          setInitialFootprint(data.overall_footprint);
        }
      });
  
    const unsubscribeCurrent = firestore()
      .collection("current_footprint")
      .doc(userUid)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data();
          setCurrentFootprint(data.overall_footprint);
        }
      });
  
    // Cleanup function to unsubscribe from Firestore listeners
    return () => {
      unsubscribeInitial();
      unsubscribeCurrent();
    };
  }, [userUid]);  

  // Function to reset user details
  const resetUserDetails = () => {
    setUserUID(null);
    setUsername("");
    setRole("");
    setInitialFootprint(null);
    setCurrentFootprint(null);
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        setUserUID(user.uid);
        fetchUserDetails(user.uid); // Fetch details if user is logged in
        goToInterface(role);
      } else {
        // Reset user details when user signs out
        resetUserDetails();
        setLoading(false);
      }
    });

    // Cleanup the subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider
      value={{
        userUid,
        username,
        role,
        loading,
        currentFootprint,
        initialFootprint,
        setLoading,
        joinDate
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook for easier access
export const useUserContext = () => {
  return useContext(UserContext);
};
