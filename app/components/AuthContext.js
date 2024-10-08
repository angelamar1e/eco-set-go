// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { auth } from "./firebase";
import { getUserName } from "../utils/utils";

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to access the AuthContext
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userUid, setUserUid] = useState(null);
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(true);

  // Track authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setUserUid(authUser.uid);
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // Sign in function
  const signIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error during sign in", error);
      throw error; // Optionally handle the error in the UI
    }
  };

  // Sign up (register) function
  const signUp = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error during sign up", error);
      throw error;
    }
  };

  // Sign out function
  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error during sign out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOutUser }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
