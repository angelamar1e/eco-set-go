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
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [overallFootprint, setOverallFootprint] = useState(0);
    const [loading, setLoading] = useState(true);
    const [joinDate, setJoinDate] = useState('');

    // Function to fetch user details
    const fetchUserDetails = async (uid) => {
        setLoading(true); // Set loading to true at the beginning
        try {
            // Fetch user document from Firestore once
            const userDoc = await firestore().collection('users').doc(uid).get();
    
            if (userDoc.exists) {
                const { username, role, created_at } = userDoc.data();
                
                // Set individual user details states
                setUserUID(uid);
                setUsername(username || ''); // Fallback to an empty string if undefined
                setRole(role || ''); // Fallback to an empty string if undefined
                
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
            // Optionally reset to defaults on error
            resetUserDetails();
        } finally {
            setLoading(false); // Set loading to false after the operation
        }
        
    };

    // Function to reset user details
    const resetUserDetails = () => {
        setUserUID(null);
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
                resetUserDetails();
                setLoading(false);
            }
        });

        // Cleanup the subscription on unmount
        return () => unsubscribe();
    },[]);

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
        <UserContext.Provider value={{ userUid, username, role, overallFootprint, loading, setLoading, joinDate }}>
            {children}
        </UserContext.Provider>
    );
};

// Create a custom hook for easier access
export const useUserContext = () => {
    return useContext(UserContext);
};