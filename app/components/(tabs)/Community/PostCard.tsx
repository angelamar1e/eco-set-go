import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Card, Text, Layout, Input } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { Timestamp } from '@react-native-firebase/firestore';
import { Menu, Provider } from 'react-native-paper'; 

interface PostCardProps {
  content: string;
  userName: string;
  timestamp: Timestamp; 
}

const StyledCard = styled(Card);
const StyledText = styled(Text);
const StyledLayout = styled(Layout);
const StyledInput = styled(Input);

const formatTimeAgo = (timestamp: Timestamp) => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - timestamp.toDate().getTime()) / 1000); // Get the difference in seconds
  let interval = Math.floor(seconds / 31536000); // Years
  if (interval > 1) return `${interval} years ago`;

  interval = Math.floor(seconds / 2592000); // Months
  if (interval > 1) return `${interval} months ago`;

  interval = Math.floor(seconds / 86400); // Days
  if (interval > 1) return `${interval} days ago`;

  interval = Math.floor(seconds / 3600); // Hours
  if (interval > 1) return `${interval} hours ago`;

  interval = Math.floor(seconds / 60); // Minutes
  if (interval > 1) return `${interval} minutes ago`;

  return `${seconds} seconds ago`; // Fallback for seconds
};

const PostCard: React.FC<PostCardProps> = ({ content, userName, timestamp }) => {
  const [comment, setComment] = useState('');
  const [isHearted, setIsHearted] = useState(false);

  const handleCommentSubmit = () => {
    console.log('Comment submitted:', comment);
    setComment('');
  };

  const handleHeartPress = () => {
    setIsHearted(!isHearted); 
    console.log('Heart pressed!');
  };

  // Format the timestamp to a relative time string
  const formattedTimestamp = formatTimeAgo(timestamp);

  return (
    <StyledCard className="p-1 mb-2 ml-2 mr-2 rounded-lg">
      <StyledLayout>
        <StyledText category='s1' className='font-bold'>@{userName}</StyledText>
        <StyledText category='c1' className='text-gray-500'>{formattedTimestamp}</StyledText>
      </StyledLayout>

      <StyledLayout className="mt-2">
        <StyledText category='p1'>{content}</StyledText>
      </StyledLayout>

      <StyledLayout className="flex-row items-center justify-center mt-2">
        {/* Heart button */}
        <TouchableOpacity onPress={handleHeartPress}>
          <Ionicons 
            name={isHearted ? "heart" : "heart-outline"} 
            size={20} 
            color={isHearted ? "#34C759" : "#A9A9A9"} 
          />
        </TouchableOpacity>

        <StyledInput
          className="flex-1 p-2 rounded-full ml-2"
          placeholder="Add a comment..."
          value={comment}
          onChangeText={setComment}
          onSubmitEditing={handleCommentSubmit}
        />
      </StyledLayout>
    </StyledCard>
  );
};

export default PostCard;
