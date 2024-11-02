import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Modal, TouchableWithoutFeedback } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Card, Text, Layout, Input, Button } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { Timestamp } from '@react-native-firebase/firestore';
import { formatTimeAgo } from '@/app/utils/communityUtils';
import { firebase } from '@react-native-firebase/firestore';

interface Comment {
  id: string;
  postId: string;
  userName: string;
  timestamp: Timestamp;
  content: string;
}

interface ListingCardProps {
  id: string;
  content: string;
  userName: string;
  price: string;
  timestamp: Timestamp;
  onEdit: (newContent: string, newPrice: string) => Promise<void>;
  onDelete: () => Promise<void>;
}

const StyledCard = styled(Card);
const StyledText = styled(Text);
const StyledLayout = styled(Layout);
const StyledInput = styled(Input);
const StyledButton = styled(Button);

const ListingCard: React.FC<ListingCardProps> = ({ 
  id, 
  content, 
  userName, 
  price, 
  timestamp, 
  onEdit, 
  onDelete,
}) => {
  const [editedContent, setEditedContent] = useState(content);
  const [editedPrice, setEditedPrice] = useState(price);
  const [showMenu, setShowMenu] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false); // State for comment modal
  const [newComment, setNewComment] = useState("");
  const [username, setUsername] = useState("");
  const [uid, setUid] = useState("");
  const [comments, setComments] = useState<Comment[]>([]); // State for comments

  const closeMenu = () => setShowMenu(false);
  const formattedTimestamp = formatTimeAgo(timestamp);

  useEffect(() => {
    if (editModalVisible) {
      setEditedContent(content);
      setEditedPrice(price);
    }
  }, [editModalVisible, content, price]);

  const fetchUserInfo = async () => {
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      const userRef = firebase.firestore().collection('users').doc(currentUser.uid);
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

  useEffect(() => {
    fetchUserInfo();
    fetchComments(); // Fetch comments when component mounts
  }, []);

  const fetchComments = async () => {
    const commentsSnapshot = await firebase.firestore().collection('comments').where('postId', '==', id).get();
    const fetchedComments = commentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Comment[];
    setComments(fetchedComments);
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        if (!username || !uid) {
          console.warn("Cannot add comment: Username or UID is not defined.");
          return;
        }

        const commentData = {
          postId: id,
          userName: username,
          uid: uid,
          content: newComment,
          timestamp: Timestamp.fromDate(new Date()),
        };

        // Add comment to Firestore
        const docRef = await firebase.firestore().collection('comments').add(commentData);

        // Update local comments state with the new comment
        const newCommentObj = {
          id: docRef.id, // Add the generated ID from Firestore
          ...commentData, // Spread the existing comment data
        };
        setComments(prevComments => [...prevComments, newCommentObj]); // Add the new comment to the comments array
        setNewComment(""); // Clear the input field
      } catch (error) {
        console.error("Error adding comment: ", error);
      }
    } else {
      console.warn("Comment cannot be empty");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={closeMenu}>
      <StyledCard className="p-1 mb-2 ml-2 mr-2 rounded-lg">
        <StyledLayout className="flex-row justify-between">
          <View>
            <StyledText category="s1" className="font-bold">
              @{userName}
            </StyledText>
            <StyledText category="c1" className="text-gray-500">
              {formattedTimestamp}
            </StyledText>
          </View>

          <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
            <Ionicons name="ellipsis-vertical" size={20} color="#A9A9A9" />
          </TouchableOpacity>
        </StyledLayout>

        <StyledLayout className="mt-2">
          <StyledText category="p1">{content}</StyledText>
        </StyledLayout>

        <StyledLayout className="mt-2">
          <StyledText category="p1" className="font-bold">
            ₱{price}
          </StyledText>
        </StyledLayout>

        {/* Popup Menu */}
        {showMenu && (
          <View className="absolute right-0 top-0 mt-2 bg-white border border-gray-200 rounded shadow-lg p-2">
            <StyledButton
              size='small'
              className='font-bold'
              appearance='ghost'
              status='info'
              onPress={() => {
                setEditModalVisible(true);
                setShowMenu(false);
              }}
            >
              Edit
            </StyledButton>

            <StyledButton
              size='small'
              className='font-bold'
              appearance='ghost'
              status='danger'
              onPress={() => {
                setConfirmDeleteVisible(true);
                setShowMenu(false);
              }}
            >
              Delete
            </StyledButton>
          </View>
        )}

        {/* Comment Button */}
      <StyledButton onPress={() => setCommentModalVisible(true)} className="mt-2">
        Add Comment
      </StyledButton>

        {/* Edit Modal */}
        <Modal transparent={true} visible={editModalVisible} animationType="slide">
          <TouchableWithoutFeedback onPress={() => setEditModalVisible(false)}>
            <StyledLayout className="flex-1 justify-center items-center bg-black bg-opacity-30">
              <TouchableWithoutFeedback>
                <StyledLayout className="bg-white p-5 m-2 rounded-lg" style={{ width: '90%', maxWidth: 400 }}>
                  <StyledText category="h6" className="mb-2">
                    Edit Listing
                  </StyledText>
                  <StyledInput
                    multiline={true}
                    value={editedContent}
                    onChangeText={setEditedContent}
                    className="rounded-lg"
                    placeholder="Edit your content"
                  />
                  <StyledInput
                    value={editedPrice}
                    onChangeText={setEditedPrice}
                    className="rounded-lg mt-2"
                    placeholder="Edit price"
                    keyboardType="numeric"
                  />
                  <StyledLayout className="flex-row justify-end mt-2">
                    <StyledButton
                      onPress={async () => {
                        await onEdit(editedContent, editedPrice); // Pass both content and price
                        setEditModalVisible(false);
                      }}
                      status="success"
                      appearance="filled"
                      size="small"
                      className="rounded-full"
                    >
                      Finish Editing
                    </StyledButton>
                  </StyledLayout>
                </StyledLayout>
              </TouchableWithoutFeedback>
            </StyledLayout>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal transparent={true} visible={confirmDeleteVisible} animationType="slide">
          <TouchableWithoutFeedback onPress={() => setConfirmDeleteVisible(false)}>
            <StyledLayout className="flex-1 justify-center items-center bg-black bg-opacity-30">
              <TouchableWithoutFeedback>
                <StyledLayout className="bg-white p-5 rounded-lg">
                  <StyledText>Are you sure you want to delete this listing?</StyledText>
                  <StyledLayout className="flex-row justify-between mt-4">
                    <StyledButton
                      appearance="ghost"
                      status="info"
                      onPress={() => setConfirmDeleteVisible(false)}
                    >
                      Cancel
                    </StyledButton>
                    <StyledButton appearance="ghost" status="danger" onPress={onDelete}>
                      Delete
                    </StyledButton>
                  </StyledLayout>
                </StyledLayout>
              </TouchableWithoutFeedback>
            </StyledLayout>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Comment Modal */}
        <Modal transparent={true} visible={commentModalVisible} animationType="slide">
          <TouchableWithoutFeedback onPress={() => setCommentModalVisible(false)}>
            <StyledLayout className="flex-1 justify-center items-center bg-black bg-opacity-30">
              <TouchableWithoutFeedback>
                <StyledLayout className="bg-white p-5 rounded-lg w-90%">
                  <StyledText category="h6" className="mb-2">
                    Comments
                  </StyledText>

                  {/* Comments List */}
                  {comments.length > 0 ? (
                    comments.map(comment => (
                      <StyledLayout key={comment.id} className="p-2 border-b border-gray-300">
                        <StyledText category="s1" className="font-bold">
                          @{comment.userName}
                        </StyledText>
                        <StyledText category="p1">{comment.content}</StyledText>
                        <StyledText category="c1" className="text-gray-500">
                          {formatTimeAgo(comment.timestamp)}
                        </StyledText>
                      </StyledLayout>
                    ))
                  ) : (
                    <StyledText category="p1" className="text-gray-500">No comments yet.</StyledText>
                  )}

                  {/* New Comment Input */}
                  <StyledInput
                    className="mt-2"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChangeText={setNewComment}
                  />
                  <StyledButton
                    className="mt-2"
                    onPress={handleAddComment}
                    status="success"
                  >
                    Submit
                  </StyledButton>
                </StyledLayout>
              </TouchableWithoutFeedback>
            </StyledLayout>
          </TouchableWithoutFeedback>
        </Modal>
      </StyledCard>
    </TouchableWithoutFeedback>
  );
};

export default ListingCard;
