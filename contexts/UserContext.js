import React, { createContext, useContext, useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth'; // Firebase Auth
import firestore from '@react-native-firebase/firestore'; // Firebase Firestore
import { router } from 'expo-router';
import { goToInterface } from '@/app/utils/utils';

// Create a User Context
const UserContext = createContext();

// Create a Provider Component
export const UserProvider = ({ children }) => {
    const [userUid, setUserUID] = useState(null);
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [overallFootprint, setOverallFootprint] = useState(null);
    const [loading, setLoading] = useState(true);

    // Function to fetch user details
    const fetchUserDetails = async (uid) => {
        setLoading(true); // Set loading to true at the beginning
        try {
            // Fetch user document from Firestore once
            const userDoc = await firestore().collection('users').doc(uid).get();

            if (userDoc.exists) {
                const { username, role } = userDoc.data(); // Destructure username and role from the fetched document

                // Set individual user details states
                setUserUID(uid);
                setUsername(username || ''); // Fallback to an empty string if undefined
                setRole(role || ''); // Fallback to an empty string if undefined
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

    // Function to reset user details
    const resetUserDetails = (uid) => {
        setUserUID(uid);
        setUsername('');
        setRole('');
        setOverallFootprint(null);
    };

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged((user) => {
            if (user) {
                fetchUserDetails(user.uid); // Fetch details if user is logged in
                goToInterface(role);
            } else {
                // Reset user details when user signs out
                resetUserDetails(null);
                setLoading(false);
            }
        });

        // Cleanup the subscription on unmount
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (userUid) {
            // Setting up the snapshot listener
            const unsubscribe = firestore()
                .collection('current_footprint')
                .doc(userUid)
                .onSnapshot((doc) => {
                    const footprint = doc.data()?.overall_footprint; // Use optional chaining for safety
                    setOverallFootprint(footprint);
                });
            
            // Cleanup the listener on unmount or userUid change
            return () => unsubscribe();
        }
    }, [userUid]);
    

    return (
        <UserContext.Provider value={{ userUid, username, role, overallFootprint, loading, setLoading }}>
            {children}
        </UserContext.Provider>
    );
};

// Create a custom hook for easier access
export const useUserContext = () => {
    return useContext(UserContext);
};