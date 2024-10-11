import React, { createContext, useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';

// Create a context
export const QuizContext = createContext();

// Create a provider component
export const QuizDocsProvider = ({ children }) => {
  const [questionDocumentIds, setQuestionDocumentIds] = useState([]); // State to store document IDs
  const questionCollection = firestore().collection('quiz');

  // Fetch document IDs from Firestore
  useEffect(() => {
    const fetchDocumentIds = async () => {
      try {
        const snapshot = await questionCollection.get();
        const ids = snapshot.docs.map(doc => doc.id);

         // Sort the document IDs as numbers
         const sortedIds = ids
         .map(id => parseInt(id, 10)) // Convert to numbers
         .sort((a, b) => a - b) // Sort in ascending order
         .map(id => id.toString()); // Convert back to strings if needed

        setQuestionDocumentIds(sortedIds); // Set the document IDs in the state
      } catch (error) {
        console.error('Error fetching document IDs:', error);
      }
    };

    fetchDocumentIds();
  }, []); // Fetch only once when the component mounts

  // Pass the documentIds state to children components via context
  return (
    <QuizContext.Provider value={{ questionDocumentIds, questionCollection }}>
      {children}
    </QuizContext.Provider>
  );
};
