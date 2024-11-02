import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native'; // Import Alert from react-native

// Define a type for the reflection
interface Reflection {
  id: string;
  content: string;
  date: string;
  uid: string;
}

// Fetch reflections
export const fetchReflections = async (dateFilter?: string): Promise<Reflection[]> => {
  const reflectionsRef = firestore().collection('reflections');
  const query = dateFilter ? reflectionsRef.where('date', '==', dateFilter) : reflectionsRef;
  const snapshot = await query.get();

  // Ensure that the returned data includes all the required properties
  return snapshot.docs.map(doc => ({
    id: doc.id,
    content: doc.data().content || '', // Fallback to empty string if content is undefined
    date: doc.data().date || '', // Fallback to empty string if date is undefined
    uid: doc.data().uid || '' // Fallback to empty string if uid is undefined
  }));
};

// Create reflection
export const createReflection = async (reflection: { content: string; date: string; uid: string }): Promise<void> => {
  await firestore().collection('reflections').add(reflection);
};

// Delete reflection
export const deleteReflection = async (id: string): Promise<void> => {
  await firestore().collection('reflections').doc(id).delete();
};

// Edit reflection
export const editReflection = async (id: string, newContent: string): Promise<void> => {
  await firestore().collection('reflections').doc(id).update({ content: newContent });
};

// Confirm delete reflection
export const confirmDeleteReflection = async (id: string): Promise<void> => {
  await deleteReflection(id);
  Alert.alert('Success', 'Reflection deleted successfully.');
};
