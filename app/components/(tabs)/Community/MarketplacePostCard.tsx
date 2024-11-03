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
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [username, setUsername] = useState("");
  const [uid, setUid] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null); // State for the comment to delete
  const [confirmCommentDeleteVisible, setConfirmCommentDeleteVisible] = useState(false); // State for comment delete confirmation

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
    fetchComments(); 
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

        const docRef = await firebase.firestore().collection('comments').add(commentData);
        const newCommentObj = {
          id: docRef.id,
          ...commentData,
        };
        setComments(prevComments => [...prevComments, newCommentObj]);
        setNewComment("");
      } catch (error) {
        console.error("Error adding comment: ", error);
      }
    } else {
      console.warn("Comment cannot be empty");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await firebase.firestore().collection('comments').doc(commentId).delete();
      setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
      setCommentToDelete(null);
      setConfirmCommentDeleteVisible(false); // Close comment delete confirmation
    } catch (error) {
      console.error("Error deleting comment: ", error);
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
              Delete Listing
            </StyledButton>
          </View>
        )}

        {/* Comment Button */}
        <StyledButton 
          appearance='ghost'
          status='basic'
          size='small'
          onPress={() => setCommentModalVisible(true)} 
          className="mt-2 items-center rounded-full flex-row">
          <StyledText>Add a comment</StyledText>
        </StyledButton>

        {/* Edit Modal */}
        <Modal transparent={true} visible={editModalVisible} animationType="slide">
          <TouchableWithoutFeedback onPress={() => setEditModalVisible(false)}>
            <StyledLayout className="flex-1 justify-center items-center bg-black bg-opacity-30">
              <TouchableWithoutFeedback>
                <StyledLayout className="bg-white p-5 rounded-lg" style={{ width: '90%', maxWidth: 400 }}>
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
                        await onEdit(editedContent, editedPrice);
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

        {/* Delete Listing Confirmation Modal */}
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
                <StyledLayout className="bg-white p-5 rounded-lg" style={{ width: '95%', maxWidth: 600 }}>
                  <StyledText category="h6" className="mb-2">
                    Comments
                  </StyledText>

                  {/* Comments List */}
                  {comments.length > 0 ? (
                    comments
                      .slice()
                      .sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis())
                      .map((comment) => (
                        <View key={comment.id} className="border-b border-gray-200 pb-2 mb-2">
                          <StyledText className="font-bold">@{comment.userName}</StyledText>
                          <StyledText>{comment.content}</StyledText>
                          <StyledText className="text-xs text-gray-500">{formatTimeAgo(comment.timestamp)}</StyledText>
                          <TouchableOpacity onPress={() => {
                            setCommentToDelete(comment);
                            setConfirmCommentDeleteVisible(true);
                          }}>
                            <StyledText className="text-red-500 text-xs text-right">Delete</StyledText>
                          </TouchableOpacity>
                        </View>
                      ))
                  ) : (
                    <StyledText className="text-gray-500">No comments yet.</StyledText>
                  )}

                  {/* New Comment Input */}
                  <StyledInput
                    placeholder="Add a comment..."
                    value={newComment}
                    onChangeText={setNewComment}
                    className="rounded-lg m-2"
                  />
                  <StyledLayout className="flex-row justify-end">
                    <StyledButton onPress={handleAddComment} disabled={!newComment.trim()} 
                      className="m-1 rounded-full justify-end"
                      status="success"
                      size="small"
                      appearance="filled">
                      Send
                    </StyledButton>
                  </StyledLayout>
                </StyledLayout>
              </TouchableWithoutFeedback>
            </StyledLayout>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Comment Deletion Confirmation Modal */}
        <Modal transparent={true} visible={confirmCommentDeleteVisible} animationType="slide">
          <TouchableWithoutFeedback onPress={() => setConfirmCommentDeleteVisible(false)}>
            <StyledLayout className="flex-1 justify-center items-center bg-black bg-opacity-30">
              <TouchableWithoutFeedback>
                <StyledLayout className="bg-white p-5 rounded-lg">
                  <StyledText>Are you sure you want to delete this comment?</StyledText>
                  <StyledLayout className="flex-row justify-between mt-4">
                    <StyledButton
                      appearance="ghost"
                      status="info"
                      onPress={() => setConfirmCommentDeleteVisible(false)}
                    >
                      Cancel
                    </StyledButton>
                    <StyledButton 
                      appearance="ghost" 
                      status="danger" 
                      onPress={() => {
                        if (commentToDelete) {
                          handleDeleteComment(commentToDelete.id);
                        }
                      }}>
                      Delete
                    </StyledButton>
                  </StyledLayout>
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
