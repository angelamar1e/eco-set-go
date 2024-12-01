import React, { createContext, useContext, useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { useUserContext } from "./UserContext";

export const EcoActionsContext = createContext();

export const EcoActionsProvider = ({ children }) => {
    const [foodEcoActions, setFoodEcoActions] = useState([]);
    const [transportationEcoActions, setTransportationEcoActions] = useState([]);
    const [electricityEcoActions, setElectricityEcoActions] = useState([]);
    const [ecoActionsDictionary, setEcoActionsDictionary] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { userUid } = useUserContext();

    // Store whether the actions have been initialized
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (userUid && !initialized) {
            initializeEcoActions(); // Initialize when userUid changes and it's not yet initialized
        }
    }, [userUid]);

    const initializeEcoActions = async () => {
        try {
            setLoading(true); // Set loading to true whenever initialization is called

            // Fetch data from Firestore
            const snapshot = await firestore().collection("eco_actions").get();

            // Temporary variables to avoid multiple state updates
            const foodActions = [];
            const transportationActions = [];
            const electricityActions = [];
            const ecoActionsDict = {};

            // Process Firestore data
            snapshot.docs.forEach((doc) => {
                const actionId = doc.id;
                const actionData = doc.data();
                const title = actionData.title;

                // Populate the dictionary
                ecoActionsDict[actionId] = title;

                // Categorize actions
                if (actionData.category === "Food") {
                    foodActions.push(actionId);
                } else if (actionData.category === "Transportation") {
                    transportationActions.push(actionId);
                } else if (actionData.category === "Electricity") {
                    electricityActions.push(actionId);
                }
            });

            // Update state with the processed data
            setFoodEcoActions(foodActions);
            setTransportationEcoActions(transportationActions);
            setElectricityEcoActions(electricityActions);
            setEcoActionsDictionary(ecoActionsDict);

            // Mark as initialized
            setInitialized(true);
        } catch (error) {
            console.error("Error initializing eco actions:", error);
            setError(error);
        } finally {
            setLoading(false); // Always set loading to false at the end
        }
    };

    // Function to get an eco action title by its ID
    const getEcoActionTitle = (id) => {
        return ecoActionsDictionary[id] || "Unknown Action";
    };

    return (
        <EcoActionsContext.Provider
            value={{
                foodEcoActions,
                transportationEcoActions,
                electricityEcoActions,
                initializeEcoActions,
                loading,
                error,
                getEcoActionTitle,
            }}
        >
            {children}
        </EcoActionsContext.Provider>
    );
};

// Custom hook for easier access
export function useActionsContext() {
    return useContext(EcoActionsContext);
}
