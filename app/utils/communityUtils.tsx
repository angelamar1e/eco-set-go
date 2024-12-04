import { Timestamp } from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/auth';
import { sendNotification } from '../components/(tabs)/Settings/Preferences';
import { useUserContext } from '@/contexts/UserContext';

export const formatTimeAgo = (timestamp: Timestamp | Date | null | undefined) => {
  if (!timestamp) return 'Unknown time';
  const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
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

export const fetchUserInfo = async (setUsername: (username: string) => void, setUid: (uid: string) => void) => {
  const currentUser = firebase.auth().currentUser;
  if (currentUser) {
    const userRef = firestore().collection('users').doc(currentUser.uid);
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      setUsername(userData?.username || "");
      setUid(currentUser.uid);
    } else {
      console.warn("User document does not exist.");
    }
  } else {
    console.warn("No user is currently signed in.");
  }
};

export const handleAddComment = async (
  newComment: string,
  postId: string,
  username: string,
  uid: string,
  setNewComment: (comment: string) => void,
) => {
  if (newComment.trim()) {
    try {
      if (!username || !uid) {
        console.warn("Cannot add comment: Username or UID is not defined.");
        return;
      }

      // Add the comment to the database
      const commentData = {
        postId,
        userName: username,
        uid,
        content: newComment,
        timestamp: Timestamp.fromDate(new Date()),
      };
      await firestore().collection("comments").add(commentData);
      setNewComment("");

      // Fetch the post owner details
      const postDoc = await firestore().collection("posts").doc(postId).get();
      if (!postDoc.exists) {
        console.warn("Post not found.");
        return;
      }

      const postOwnerUid = postDoc.data()?.userUID;

      // Fetch the expoPushToken of the post owner
      const postOwnerDoc = await firestore().collection("users").doc(postOwnerUid).get();
      const expoPushToken = postOwnerDoc.data()?.expoPushToken;

      const formatted = newComment.length > 50 ? `${newComment.trim().slice(0, 50)}...` : newComment.trim()

      if (expoPushToken && uid != postOwnerUid) {
        // Send the notification
        await sendNotification(
          "New comment on your post 💭",
          `@${username}: ${formatted}`,
          expoPushToken,
          "community-posts"
        );
      } else {
        console.warn("Post owner does not have a push token. Same post owner/commenter.");
      }
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  } else {
    console.warn("Comment cannot be empty");
  }
};


export const handleDeleteComment = async (commentId: string) => {
  try {
    await firestore().collection('comments').doc(commentId).delete();
  } catch (error) {
    console.error("Error deleting comment: ", error);
  }
};

export const confirmDeletePost = async (id: string) => {
  try {
    await firestore().collection('posts').doc(id).delete();
    console.log('Post deleted successfully!');
  } catch (error) {
    console.error("Error deleting post: ", error);
  }
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

export const handleDeletePress = (setConfirmDeleteVisible: React.Dispatch<React.SetStateAction<boolean>>, setShowMenu: React.Dispatch<React.SetStateAction<boolean>>) => {
  setConfirmDeleteVisible(true);
};
