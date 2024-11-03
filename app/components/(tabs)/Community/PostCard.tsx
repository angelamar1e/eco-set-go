import React, { useState, useEffect } from 'react';
import { View, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Card, Text, Layout, Input, Button } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { Timestamp } from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/firestore';
import { formatTimeAgo, handleEditSubmit, confirmDeletePost } from '@/app/utils/communityUtils';

interface Comment {
  id: string;
  postId: string;
  userName: string;
  timestamp: Timestamp;
  content: string;
}

interface PostCardProps {
  id: string; // Post ID
  content: string;
  userName: string;
  timestamp: Timestamp;
  onEdit: (newContent: string) => Promise<void>;
  onDelete: () => Promise<void>;
  comments?: Comment[]; // Optional comments prop
}

const StyledCard = styled(Card);
const StyledText = styled(Text);
const StyledLayout = styled(Layout);
const StyledInput = styled(Input);
const StyledButton = styled(Button);

const PostCard: React.FC<PostCardProps> = ({
  id,
  content,
  userName,
  timestamp,
  onEdit,
  onDelete,
  comments = [],
}) => {
  const [editedContent, setEditedContent] = useState(content);
  const [showMenu, setShowMenu] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null); // State for comment to delete
  const [confirmCommentDeleteVisible, setConfirmCommentDeleteVisible] = useState(false); // State for comment delete confirmation
  const [username, setUsername] = useState("");
  const [uid, setUid] = useState("");
  const [loading, setLoading] = useState(false);

  const formattedTimestamp = formatTimeAgo(timestamp);

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
  }, []);

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

        await firebase.firestore().collection('comments').add(commentData);
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
      setCommentToDelete(null);
      setConfirmCommentDeleteVisible(false); // Close comment delete confirmation
    } catch (error) {
      console.error("Error deleting comment: ", error);
    }
  };

  return (
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

      {/* Popup Menu */}
      {showMenu && (
        <View className="absolute right-0 top-0 mt-2 bg-white border border-gray-200 rounded shadow-lg p-2">
          <StyledButton
            size="small"
            className="font-bold"
            appearance="ghost"
            status="info"
            onPress={() => {
              setEditModalVisible(true);
              setShowMenu(false);
            }}
          >
            Edit
          </StyledButton>
          <StyledButton
            size="small"
            className="font-bold"
            appearance="ghost"
            status="danger"
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
      <StyledButton 
        appearance='ghost'
        status='basic'
        size='small'
        onPress={() => setCommentModalVisible(true)} 
        className="mt-2 items-center rounded-full flex-row">
        <StyledText>Add a comment</StyledText>
      </StyledButton>

      {/* Comment Modal */}
      <Modal transparent={true} visible={commentModalVisible} animationType="slide">
        <TouchableWithoutFeedback onPress={() => setCommentModalVisible(false)}>
          <StyledLayout className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
            <TouchableWithoutFeedback>
              <StyledLayout className="bg-white p-5 rounded-lg" style={{ width: '90%', maxWidth: 400 }}>
                <StyledText category="h6" className="font-bold mb-2">Comments</StyledText>
                {comments.length > 0 ? (
                  comments
                    .slice() 
                    .sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis()) // Sort comments by timestamp
                    .map((comment) => (
                      <View key={comment.id} className="border-b border-gray-200 pb-2 mb-2">
                        <StyledText className="font-bold">@{comment.userName}</StyledText>
                        <StyledText>{comment.content}</StyledText>
                        <StyledText className="text-xs text-gray-500">{formatTimeAgo(comment.timestamp)}</StyledText>
                        <TouchableOpacity onPress={() => {
                          setCommentToDelete(comment);
                          setConfirmCommentDeleteVisible(true);
                        }}>
                          <StyledLayout className='flex-row justify-end'>
                          <StyledText className="text-red-500 text-xs">Delete</StyledText>
                          </StyledLayout>
                          
                        </TouchableOpacity>
                      </View>
                    ))
                ) : (
                  <StyledText className="text-gray-500">No comments yet.</StyledText>
                )}
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

      {/* Edit Modal */}
      <Modal transparent={true} visible={editModalVisible} animationType="slide">
        <TouchableWithoutFeedback onPress={() => setEditModalVisible(false)}>
          <StyledLayout className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
            <TouchableWithoutFeedback>
              <StyledLayout className="bg-white p-5 rounded-lg" style={{ width: '90%', maxWidth: 400 }}>
                <StyledText category='s1' className='font-bold m-2'>Edit post</StyledText>
                <StyledInput
                  multiline={true}
                  value={editedContent}
                  onChangeText={setEditedContent}
                  className="rounded-lg"
                />
                <StyledLayout className="flex-row justify-between mt-4">
                  <StyledButton
                    onPress={() => setEditModalVisible(false)}
                    appearance="filled"
                    status="info"
                    size='small'
                    className='rounded-full'
                  >
                    <StyledText>Cancel</StyledText>
                  </StyledButton>
                  <StyledButton
                    onPress={() => handleEditSubmit(onEdit, editedContent, setEditModalVisible, setLoading)}
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

      {/* Post Deletion Confirmation Modal */}
      <Modal transparent={true} visible={confirmDeleteVisible} animationType="slide">
        <TouchableWithoutFeedback onPress={() => setConfirmDeleteVisible(false)}>
          <StyledLayout className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
            <TouchableWithoutFeedback>
              <StyledLayout className="bg-white p-5 rounded-lg">
                <StyledText category='s1' className='font-bold m-2 text-center'>Delete post</StyledText>
                <StyledText className='m-2 text-center'>Are you sure you want to delete this post?</StyledText>
                <StyledLayout className="flex-row justify-between m-2">
                  <StyledButton
                    className="font-bold rounded-full"
                    appearance="filled"
                    status="info"
                    size='small'
                    onPress={() => {
                      setConfirmDeleteVisible(false);
                      setShowMenu(false);
                    }}
                  >
                    Cancel
                  </StyledButton>
                  <StyledButton
                    className="font-bold rounded-full"
                    appearance="filled"
                    status="danger"
                    size='small'
                    onPress={() => confirmDeletePost(id, setConfirmDeleteVisible, setShowMenu)}
                  >
                    Delete
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
          <StyledLayout className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
            <TouchableWithoutFeedback>
              <StyledLayout className="bg-white p-5 rounded-lg">
                <StyledText category='s1' className='font-bold m-2 text-center'>Delete comment</StyledText>
                <StyledText className='m-2 text-center'>Are you sure you want to delete this comment?</StyledText>
                <StyledLayout className="flex-row justify-between m-2">
                  <StyledButton
                    className="font-bold rounded-full"
                    appearance="filled"
                    status="info"
                    size='small'
                    onPress={() => {
                      setConfirmCommentDeleteVisible(false);
                    }}
                  >
                    Cancel
                  </StyledButton>
                  <StyledButton
                    className="font-bold rounded-full"
                    appearance="filled"
                    status="danger"
                    size='small'
                    onPress={() => {
                      if (commentToDelete) {
                        handleDeleteComment(commentToDelete.id);
                      }
                    }}
                  >
                    Delete
                  </StyledButton>
                </StyledLayout>
              </StyledLayout>
            </TouchableWithoutFeedback>
          </StyledLayout>
        </TouchableWithoutFeedback>
      </Modal>
    </StyledCard>
  );
};

export default PostCard;
