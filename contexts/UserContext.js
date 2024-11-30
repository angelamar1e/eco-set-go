import React, { createContext, useContext, useEffect, useState } from "react";
import auth from "@react-native-firebase/auth"; // Firebase Auth
import firestore from "@react-native-firebase/firestore"; // Firebase Firestore
import { router } from "expo-router";
import { goToInterface } from "@/app/utils/utils";
import moment from "moment";

// Create a User Context
const UserContext = createContext();

// Create a Provider Component
export const UserProvider = ({ children }) => {
  const [userUid, setUserUID] = useState(null);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [notification, setNotification] = useState("");
  const [role, setRole] = useState("");
  const [currentFootprint, setCurrentFootprint] = useState(0);
  const [initialFootprint, setInitialFootprint] = useState(0);
  const [points, setPoints] = useState(100);
  const [redeemablePoints, setRedeemablePoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [joinDate, setJoinDate] = useState("");
  const [profileCreated, setProfileCreated] = useState(true);
  const [level, setLevel] = useState(1);

  const fetchUserDetails = (uid) => {
    setLoading(true);

    try {
      const unsubscribe = firestore()
        .collection("users")
        .doc(uid)
        .onSnapshot(
          (doc) => {
            if (doc.exists) {
              const {
                name = "",
                username = "",
                role = "",
                created_at,
                points = 0,
                redeemablePoints = 0,
                notificationPreferences = "",
                level = 1,
              } = doc.data();

              setName(name);
              setNotification(notificationPreferences);
              setRole(role);
              setUsername(username);
              setPoints(points);
              setRedeemablePoints(redeemablePoints);
              setLevel(level);

              if (created_at) {
                const parsedDate = moment(
                  created_at,
                  "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ"
                ).format("YYYY-DD-MM");
                setJoinDate(parsedDate); // Should now display as "YYYY-MM-DD"
              } else {
                setJoinDate("");
              }
            } else {
              console.log("User document does not exist:", uid);
              resetUserDetails();
            }
          },
          (error) => {
            console.error("Error fetching user details in snapshot:", error);
            resetUserDetails();
          }
        );

      return unsubscribe; // Return the unsubscribe function to clean up later if needed
    } catch (error) {
      console.error("Error setting up snapshot:", error);
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
      .onSnapshot(
        (doc) => {
          if (doc.exists) {
            const data = doc.data();
            setInitialFootprint(data.overall_footprint);
          }
        },
        { merge: true }
      );

    const unsubscribeCurrent = firestore()
      .collection("current_footprint")
      .doc(userUid)
      .onSnapshot(
        (doc) => {
          if (doc.exists) {
            const data = doc.data();
            setCurrentFootprint(data.overall_footprint);
          }
        },
        { merge: true }
      );

    const unsubscribePoints = firestore()
      .collection("users")
      .doc(userUid)
      .onSnapshot(
        (doc) => {
          if (doc.exists) {
            const data = doc.data();
            setPoints(data.points);
            setRedeemablePoints(data.redeemablePoints);
          }
        },
        { merge: true }
      );

    return () => {
      unsubscribeInitial();
      unsubscribeCurrent();
      unsubscribePoints();
    };
  }, [userUid]);

  // Function to reset user details
  const resetUserDetails = () => {
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
        if (profileCreated) {
          fetchUserDetails(user.uid);
        }
      } else {
        resetUserDetails();
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [profileCreated]);

  // Trigger goToInterface only when user is signed in and role is valid
  useEffect(() => {
    if (userUid && role) {
      goToInterface(role);
    }
  }, [userUid, role]); // Depend on both userUid and role

  return (
    <UserContext.Provider
      value={{
        fetchUserDetails,
        setProfileCreated,
        name,
        userUid,
        username,
        notification,
        role,
        points,
        redeemablePoints,
        loading,
        currentFootprint,
        initialFootprint,
        setLoading,
        joinDate,
        level,
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
