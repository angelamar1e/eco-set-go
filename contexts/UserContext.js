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
  const [userUid, setUserUID] = useState(null);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [currentFootprint, setCurrentFootprint] = useState(0);
  const [initialFootprint, setInitialFootprint] = useState(0);
  const [loading, setLoading] = useState(true);
  const [joinDate, setJoinDate] = useState('');

  // Function to fetch user details
  const fetchUserDetails = async (uid) => {
    setLoading(true);
    try {
      // Fetch user document from Firestore once
      const userDoc = await firestore().collection("users").doc(uid).get();

      if (userDoc.exists) {
        const { username, role } = userDoc.data();
        setRole(role || ""); // Fallback to an empty string if undefined
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
        resetUserDetails();
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      resetUserDetails();
    } finally {
      setLoading(false);
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

    return () => {
      unsubscribeInitial();
      unsubscribeCurrent();
    };
  }, [userUid]);

  // Function to reset user details
  const resetUserDetails = () => {
    console.log("RESET");
    setUserUID(null);
    setUsername("");
    setRole(""); // Ensure role is cleared
    setInitialFootprint(0);
    setCurrentFootprint(0);
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        setUserUID(user.uid);
        fetchUserDetails(user.uid);
        console.log(user);
      } else {
        resetUserDetails();
        console.log(user);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Trigger goToInterface only when user is signed in and role is valid
  useEffect(() => {
    if (userUid && role) {
      goToInterface(role);
    }
  }, [userUid, role]); // Depend on both userUid and role

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
