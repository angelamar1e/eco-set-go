import React, { useEffect, useState } from 'react';
import firestore from "@react-native-firebase/firestore";
import { Button, Text } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserContext } from '@/contexts/UserContext';
import { myTheme } from '@/constants/custom-theme';

const StyledButton = styled(Button);
const StyledText = styled(Text);

interface ConvertButtonProps {
  reqPoints: number;
  rewardId: number;
}

const ConvertButton: React.FC<ConvertButtonProps> = ({ reqPoints, rewardId }) => {
  const [isClaimed, setIsClaimed] = useState(false);
  const { userUid, points, redeemablePoints } = useUserContext();

  // Effect to check if the reward has already been claimed from AsyncStorage
  useEffect(() => {
    const checkRewardStatus = async () => {
      const status = await AsyncStorage.getItem(rewardId.toString());
      if (status) {
        setIsClaimed(true); // If status is true, the reward is already claimed, so disable the button
      }
    };

    checkRewardStatus();
  }, [rewardId]);

  const handleClaim = async () => {
    if (redeemablePoints >= reqPoints) {
      const updateRedeemablePoints = async () => {
        firestore().collection('users').doc(userUid).set({
          redeemablePoints: redeemablePoints - reqPoints
        }, {merge: true});
      }

      updateRedeemablePoints();
      setIsClaimed(true); // Set the button as claimed
      await AsyncStorage.setItem(rewardId.toString(), 'true'); // Set status to 'true' to indicate the reward has been claimed

      Alert.alert(
        'Take a pic! 📸',
        'To avail, message Ecomove on Instagram with a screenshot of the claimed reward.'
      );
    }
    else{
      Alert.alert(
        "Oops!",
        "You do not have enough points yet, keep your eco actions up! 🌏"
      );
    }
  };

  return (
    <StyledButton
      onPress={handleClaim} // Update onPress to reference handleClaim correctly
      className="rounded-full m-0 p-0"
      disabled={isClaimed || points < reqPoints} // Disable if already claimed or insufficient points
    >
      <StyledText className='text-xs' style={{ color: isClaimed ? myTheme['color-primary-500'] : myTheme['color-basic-600'] }}>
        {isClaimed ? 'Claimed' : 'Claim'} 
      </StyledText>
    </StyledButton>
  );
};

export default ConvertButton;
