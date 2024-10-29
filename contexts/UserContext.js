import React, { createContext, useContext, useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth'; // Firebase Auth
import firestore from '@react-native-firebase/firestore'; // Firebase Firestore

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

                // Fetch overall footprint from current_footprint collection
                const footprintDoc = await firestore().collection('current_footprint').doc(uid).get();
                const footprint = footprintDoc.exists ? footprintDoc.data().overall_footprint : null;

                // Set individual user details states
                setUserUID(uid);
                setUsername(username || ''); // Fallback to an empty string if undefined
                setRole(role || ''); // Fallback to an empty string if undefined
                setOverallFootprint(footprint); // Store overall footprint
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
            } else {
                // Reset user details when user signs out
                resetUserDetails(null);
            }
        });

        // Cleanup the subscription on unmount
        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ userUid, username, role, overallFootprint, loading }}>
            {children}
        </UserContext.Provider>
    );
};

// Create a custom hook for easier access
export const useUserContext = () => {
    return useContext(UserContext);
};