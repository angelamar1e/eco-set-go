import { Timestamp } from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';

export const formatTimeAgo = (timestamp: Timestamp | Date | null | undefined) => {
    // Return a default message if the timestamp is null or undefined
    if (!timestamp) return 'Unknown time';
  
    // Convert to Date if it's a Firestore Timestamp
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
  
    // Calculate the time difference in seconds
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
    // Format based on the interval
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} years ago`;
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago`;
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} days ago`;
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} hours ago`;
    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} minutes ago`;
  
    return `${seconds} seconds ago`;
  };

export const handleDeletePost = async (id: string) => {
  try {
    await firestore().collection('posts').doc(id).delete();
    console.log('Post deleted successfully!');
  } catch (error: unknown) { // Specify the type of error
    console.error('Error deleting post: ', error);
    const errorMessage = error instanceof Error ? error.message : 'Could not delete the post. Please try again later.';
    throw new Error(errorMessage);
  }
};

export const handleEditPost = async (id: string, newContent: string) => {
  try {
    await firestore().collection('posts').doc(id).update({ content: newContent });
    console.log('Post updated successfully!');
  } catch (error: unknown) {
    console.error('Error updating post: ', error);
    const errorMessage = error instanceof Error ? error.message : 'Could not edit the post. Please try again later.';
    throw new Error(errorMessage);
  }
};

export const handleEditSubmit = async (
  onEdit: (newContent: string) => Promise<void>, 
  editedContent: string, 
  setEditModalVisible: React.Dispatch<React.SetStateAction<boolean>>, 
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setLoading(true);
  try {
    await onEdit(editedContent);
    setEditModalVisible(false); // Close modal after editing
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Could not edit the post. Please try again later.';
    throw new Error(errorMessage);
  } finally {
    setLoading(false);
  }
};

export const confirmDeletePost = async (id: string, setConfirmDeleteVisible: React.Dispatch<React.SetStateAction<boolean>>, setShowMenu: React.Dispatch<React.SetStateAction<boolean>>) => {
  try {
    await handleDeletePost(id);
    setConfirmDeleteVisible(false);
    setShowMenu(false);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred while trying to confirm delete.';
    throw new Error(errorMessage);
  }
};

export const handleDeletePress = (setConfirmDeleteVisible: React.Dispatch<React.SetStateAction<boolean>>, setShowMenu: React.Dispatch<React.SetStateAction<boolean>>) => {
  setConfirmDeleteVisible(true);
};
