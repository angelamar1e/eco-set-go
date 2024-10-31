import React, { createContext, useEffect, useState } from "react"; // Import necessary hooks
import firestore from '@react-native-firebase/firestore'; // Ensure Firestore is imported

export const EcoActionsContext = createContext();

export const EcoActionsProvider = ({ children }) => {
    const [foodEcoActions, setFoodEcoActions] = useState([]);
    const [transportationEcoActions, setTransportationEcoActions] = useState([]);
    const [electricityEcoActions, setElectricityEcoActions] = useState([]);
    const [error, setError] = useState(null); // Initialize error state
    const [loading, setLoading] = useState(true); // Initialize loading state

    useEffect(() => {
        const initializeData = async () => {
            try {
                const snapshot = await firestore().collection('eco_actions').get();
                snapshot.docs.forEach((doc) => { // Use forEach instead of map if you don't need to return a new array
                    if (doc.data().category === "Food") {
                        setFoodEcoActions(prev => [...prev, doc.id]); // Append to the previous state
                    } else if (doc.data().category === "Transportation") {
                        setTransportationEcoActions(prev => [...prev, doc.id]);
                    } else if (doc.data().category === "Electricity") {
                        setElectricityEcoActions(prev => [...prev, doc.id]);
                    }
                });
            } catch (error) {
                setError(error); // Set error if occurs
            } finally {
                setLoading(false); // Set loading to false regardless of success or failure
            }
        };

        initializeData();
    }, []);

    return (
        <EcoActionsContext.Provider value={{ foodEcoActions, transportationEcoActions, electricityEcoActions, loading, error }}>
            {children}
        </EcoActionsContext.Provider>
    );
};