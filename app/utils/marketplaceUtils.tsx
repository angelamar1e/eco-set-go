import { Timestamp } from "@react-native-firebase/firestore";
import firestore from "@react-native-firebase/firestore";
import { firebase } from "@react-native-firebase/auth";
import { Comment } from "../components/(tabs)/Community/MarketplacePostCard";
import { sendNotification } from "../components/(tabs)/Settings/Preferences";

// Format a timestamp into a human-readable "time ago" string
export const formatTimeAgo = (
  timestamp: Timestamp | Date | null | undefined
): string => {
  if (!timestamp) return "Unknown time";
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

// Fetch the current user information
export const fetchUserInfo = async (): Promise<{
  username: string;
  uid: string;
}> => {
  const currentUser = firebase.auth().currentUser;
  if (!currentUser) {
    throw new Error("No user is currently signed in.");
  }

  const userRef = firestore().collection("users").doc(currentUser.uid);
  const userDoc = await userRef.get();
  if (!userDoc.exists) {
    throw new Error("User document does not exist.");
  }

  const userData = userDoc.data();
  return {
    username: userData?.username || "",
    uid: currentUser.uid,
  };
};

// Fetch comments for a given listing
export const fetchComments = async (postId: string): Promise<Comment[]> => {
  const commentsSnapshot = await firestore()
    .collection("comments")
    .where("postId", "==", postId)
    .get();
  return commentsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Comment[];
};

// Add a new comment
export const handleAddComment = async (
  postId: string,
  username: string,
  uid: string,
  newComment: string
) => {
  if (!newComment.trim()) {
    throw new Error("Comment cannot be empty.");
  }

  const commentData = {
    postId,
    userName: username,
    uid,
    content: newComment,
    timestamp: Timestamp.fromDate(new Date()),
  };

  const docRef = await firestore().collection("comments").add(commentData);

  // Fetch the post owner details
  const postDoc = await firestore().collection("listings").doc(postId).get();
  if (!postDoc.exists) {
    console.warn("Post not found.");
    return;
  }

  const postOwnerUid = postDoc.data()?.userUID;

  // Fetch the expoPushToken of the post owner
  const postOwnerDoc = await firestore()
    .collection("users")
    .doc(postOwnerUid)
    .get();
  const expoPushToken = postOwnerDoc.data()?.expoPushToken;

  const formatted =
    newComment.length > 50
      ? `${newComment.trim().slice(0, 50)}...`
      : newComment.trim();

  if (expoPushToken && uid != postOwnerUid) {
    // Send the notification
    await sendNotification(
      "New comment on your listing 📫",
      `@${username}: ${formatted}`,
      expoPushToken,
      "community-posts"
    );
  } else {
    console.warn(
      "Post owner does not have a push token. Same post owner/commenter."
    );
  }

  return {
    id: docRef.id,
    ...commentData,
  };
};

// Delete a comment
export const handleDeleteComment = async (commentId: string) => {
  await firestore().collection("comments").doc(commentId).delete();
};

// Edit a listing
export const handleEditListing = async (
  listingId: string,
  newContent: string,
  newPrice: string
) => {
  await firestore().collection("listings").doc(listingId).update({
    content: newContent,
    price: newPrice,
  });
};

// Delete a listing
export const handleDeleteListing = async (listingId: string) => {
  await firestore().collection("listings").doc(listingId).delete();
};
