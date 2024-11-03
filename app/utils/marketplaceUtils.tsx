import firestore from '@react-native-firebase/firestore';
import { Timestamp } from '@react-native-firebase/firestore';

// Function to format timestamps into a human-readable format
export const formatTimeAgo = (timestamp: Timestamp | Date | null | undefined) => {
    if (!timestamp) return 'Unknown time';
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(seconds / 3600);
    const days = Math.floor(seconds / 86400);

    if (seconds < 60) return `${seconds} seconds ago`;
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
};

// Function to handle editing a listing
export const handleEditListing = async (listingId: string, newContent: string, newPrice: string) => {
    try {
        await firestore().collection('listings').doc(listingId).update({ 
            content: newContent,
            price: newPrice // Update price along with content
        });
        console.log('Listing updated successfully!');
    } catch (error) {
        console.error('Error updating listing:', error);
    }
};

// Function to handle deleting a listing
export const handleDeleteListing = async (listingId: string) => {
    try {
        await firestore().collection('listings').doc(listingId).delete();
        console.log('Listing deleted successfully!');
    } catch (error) {
        console.error('Error deleting listing:', error);
    }
};

// Function to handle the submission of edited content and price
export const handleEditSubmit = async (
    onEdit: (newContent: string, newPrice: string) => Promise<void>, // Updated to accept newPrice
    editedContent: string,
    editedPrice: string, // Added parameter for edited price
    setEditModalVisible: React.Dispatch<React.SetStateAction<boolean>>, 
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
    setLoading(true);
    try {
        await onEdit(editedContent, editedPrice); // Pass both content and price to onEdit
        setEditModalVisible(false); // Close modal after editing
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Could not edit the listing. Please try again later.';
        console.error(errorMessage);
    } finally {
        setLoading(false);
    }
};

// Function to confirm deletion of a post
export const confirmDeletePost = async (
    id: string, 
    setConfirmDeleteVisible: React.Dispatch<React.SetStateAction<boolean>>, 
    setShowMenu: React.Dispatch<React.SetStateAction<boolean>>
) => {
    try {
        await handleDeleteListing(id);
        setConfirmDeleteVisible(false);
        setShowMenu(false);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred while trying to confirm delete.';
        console.error(errorMessage);
    }
};

// Function to handle the delete button press
export const handleDeletePress = (
    setConfirmDeleteVisible: React.Dispatch<React.SetStateAction<boolean>>, 
    setShowMenu: React.Dispatch<React.SetStateAction<boolean>>
) => {
    setConfirmDeleteVisible(true);
};
