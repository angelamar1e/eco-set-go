import React, { createContext, useContext, useEffect, useState } from "react"; // Import necessary hooks
import firestore from '@react-native-firebase/firestore'; // Ensure Firestore is imported

export const EcoActionsContext = createContext();

export const EcoActionsProvider = ({ children }) => {
    const [foodEcoActions, setFoodEcoActions] = useState([]);
    const [transportationEcoActions, setTransportationEcoActions] = useState([]);
    const [electricityEcoActions, setElectricityEcoActions] = useState([]);
    const [ecoActionsDictionary, setEcoActionsDictionary] = useState({}); // Store eco action ID to title mapping
    const [error, setError] = useState(null); // Initialize error state
    const [loading, setLoading] = useState(true); // Initialize loading state

    useEffect(() => {
        initializeData();
    }, []);

    const initializeData = async () => {
        try {
            const snapshot = await firestore().collection('eco_actions').get();
            const ecoActionsDict = {}; // Temporary object to store ID-title mappings

            snapshot.docs.forEach((doc) => {
                const actionId = doc.id;
                const actionData = doc.data();
                const title = actionData.title;

                // Map eco action ID to title in the dictionary
                ecoActionsDict[actionId] = title;

                // Categorize eco actions based on their category
                if (actionData.category === "Food") {
                    setFoodEcoActions(prev => [...prev, actionId]); // Append to the previous state
                } else if (actionData.category === "Transportation") {
                    setTransportationEcoActions(prev => [...prev, actionId]);
                } else if (actionData.category === "Electricity") {
                    setElectricityEcoActions(prev => [...prev, actionId]);
                }
            });

            // Update the state with the populated dictionary
            setEcoActionsDictionary(ecoActionsDict);
        } catch (error) {
            setError(error); // Set error if occurs
        } finally {
            setLoading(false); // Set loading to false regardless of success or failure
        }
    };

    // Function to get eco action title by its ID
    const getEcoActionTitle = (id) => {
        return ecoActionsDictionary[id] || 'Unknown Action'; // Return 'Unknown Action' if not found
    };

    return (
        <EcoActionsContext.Provider value={{
            foodEcoActions,
            transportationEcoActions,
            electricityEcoActions,
            initializeData,
            loading,
            error,
            getEcoActionTitle // Provide the function to get the title
        }}>
            {children}
        </EcoActionsContext.Provider>
    );
};

export function useActionsContext() {
    return useContext(EcoActionsContext);
}