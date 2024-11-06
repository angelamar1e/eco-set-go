import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';

// Define a type for the reflection
interface Reflection {
  id: string;
  content: string;
  date: string;
  uid: string;
}

// Fetch reflections for the logged-in user
export const fetchReflections = async (userUid: string): Promise<Reflection[]> => {
  const reflectionsRef = firestore()
    .collection('reflections')
    .where('uid', '==', userUid); // Only fetch reflections with matching UID

  const snapshot = await reflectionsRef.get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    content: doc.data().content || '',
    date: doc.data().date || '',
    uid: doc.data().uid || ''
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
