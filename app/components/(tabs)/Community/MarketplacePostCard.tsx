import React, { useState } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Card, Text, Layout, Input } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { MarketplacePost } from '@/types/PostCardProps';

interface MarketplacePostProps extends MarketplacePost {
  id: string; 
}

const StyledCard = styled(Card);
const StyledText = styled(Text);
const StyledLayout = styled(Layout);
const StyledInput = styled(Input);

const MarketplacePostCard: React.FC<MarketplacePostProps> = ({
  id, 
  content,
  userName,
  userHandle,
  userIcon,
  contactNumber,
  price,
}) => {
  const [comment, setComment] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isHearted, setIsHearted] = useState(false);

  const handleCommentSubmit = () => {
    if (comment.trim() === '') {
      console.log('Comment cannot be empty');
      return; // Prevent empty submissions
    }
    console.log('Comment submitted:', comment);
    setComment(''); // Clear the comment input after submission
  };

  const handleHeartPress = () => {
    setIsHearted(!isHearted);
    console.log('Heart pressed!');
  };

  return (
    <StyledCard className="p-1 mb-2 ml-2 mr-2 rounded-lg">
      <StyledLayout className="flex-row items-center">
        <Image
          source={{ uri: userIcon }}
          className="w-8 h-8 rounded-full mr-2"
          alt="User Icon"
        />
        <StyledLayout>
          <StyledText category='s1' className='font-bold'>{userName}</StyledText>
          <StyledText category='c1'>{userHandle}</StyledText>
        </StyledLayout>
      </StyledLayout>

      <StyledLayout className="ml-10 mt-2">
        <StyledText category='p1'>{content}</StyledText>
        <StyledText category='p1' className="text-green-600 font-bold mt-1">₱{price}</StyledText>
        <StyledText category='p1' className="mt-1">Contact: {contactNumber}</StyledText>
      </StyledLayout>

      <StyledLayout className="flex-row items-center justify-center mt-4">
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

        />
      </StyledLayout>
    </StyledCard>
  );
};

export default MarketplacePostCard;
