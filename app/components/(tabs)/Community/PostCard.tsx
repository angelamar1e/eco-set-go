import React, { useState, useEffect } from 'react';
import { View, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Card, Text, Layout, Input, Button } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { Timestamp } from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/firestore';
import { formatTimeAgo, handleEditSubmit, confirmDeletePost, handleDeletePress } from '@/app/utils/communityUtils';

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
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [uid, setUid] = useState("");

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
            onPress={() => handleDeletePress(setConfirmDeleteVisible, setShowMenu)}
          >
            Delete
          </StyledButton>
        </View>
      )}

      {/* Comment Button */}
      <StyledButton onPress={() => setCommentModalVisible(true)} className="mt-2">
        Add Comment
      </StyledButton>

      {/* Comment Modal */}
      <Modal transparent={true} visible={commentModalVisible} animationType="slide">
        <TouchableWithoutFeedback onPress={() => setCommentModalVisible(false)}>
          <StyledLayout className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
            <TouchableWithoutFeedback>
              <StyledLayout className="bg-white p-5 rounded-lg" style={{ width: '90%', maxWidth: 400 }}>
                <StyledText category="h6" className="font-bold mb-2">Comments</StyledText>
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <View key={comment.id} className="border-b border-gray-200 pb-2 mb-2">
                      <StyledText className="font-bold">@{comment.userName}</StyledText>
                      <StyledText>{comment.content}</StyledText>
                      <StyledText className="text-xs text-gray-500">{formatTimeAgo(comment.timestamp)}</StyledText>
                    </View>
                  ))
                ) : (
                  <StyledText className="text-gray-500">No comments yet.</StyledText>
                )}
                <StyledInput
                  placeholder="Add a comment..."
                  value={newComment}
                  onChangeText={setNewComment}
                  className="mt-2"
                />
                <StyledButton onPress={handleAddComment} disabled={!newComment.trim()} className="mt-2">
                  Send
                </StyledButton>
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
                <StyledInput
                  multiline={true}
                  value={editedContent}
                  onChangeText={setEditedContent}
                  className="rounded-lg"
                />
                <StyledLayout className="flex-row justify-end mt-2">
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

      {/* Confirmation Modal */}
      <Modal transparent={true} visible={confirmDeleteVisible} animationType="slide">
        <TouchableWithoutFeedback onPress={() => setConfirmDeleteVisible(false)}>
          <StyledLayout className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
            <TouchableWithoutFeedback>
              <StyledLayout className="bg-white p-5 rounded-lg">
                <StyledText>Are you sure you want to delete this post?</StyledText>
                <StyledLayout className="flex-row justify-between mt-4">
                  <StyledButton
                    className="font-bold"
                    appearance="ghost"
                    status="info"
                    onPress={() => {
                      setConfirmDeleteVisible(false);
                      setShowMenu(false);
                    }}
                  >
                    Cancel
                  </StyledButton>
                  <StyledButton
                    className="font-bold"
                    appearance="ghost"
                    status="danger"
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
    </StyledCard>
  );
};

export default PostCard;
