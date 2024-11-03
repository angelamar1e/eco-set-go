import React, { createContext, useContext, useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { goToInterface } from '@/app/utils/utils';

// Create a User Context
const UserbaseContext = createContext();

export const UserbaseProvider = ({ children }) => {

    

    return (
        <UserbaseContext.Provider value={{ userUid, username, role, overallFootprint, loading }}>
            {children}
        </UserbaseContext.Provider>
    );
}

// Custom hook for accessing UserContext
export const useUserbaseContext = () => {
    return useContext(UserbaseContext);
};