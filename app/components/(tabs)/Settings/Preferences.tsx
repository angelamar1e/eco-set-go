import React, { useState, useEffect, useRef } from 'react';
import { Platform, Alert } from 'react-native';
import { Toggle, Text, Layout, Button, Select, SelectItem, IndexPath } from '@ui-kitten/components';
import { styled } from 'nativewind';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Divider } from 'react-native-paper';
import { useUserContext } from '@/contexts/UserContext';  
import firestore from '@react-native-firebase/firestore'; 
import Index from '../../../index';

const StyledText = styled(Text);
const StyledLayout = styled(Layout);
const StyledToggle = styled(Toggle);
const StyledButton = styled(Button);
const StyledSelect = styled(Select);

const Preferences: React.FC = () => {
  const {userUid} = useUserContext();
  const [pushNotifications, setPushNotifications] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [interval, setInterval] = useState(12); 
  const [frequency, setFrequency] = useState<string>('once'); 
  const [showTimePicker, setShowTimePicker] = useState(false);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  // Request notification permissions and set listeners
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) setExpoPushToken(token);
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response received:', response);
    });

    return () => {
      notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // Effect to handle enabling or disabling notifications
  useEffect(() => {
    if (pushNotifications) {
      if (frequency === 'once') {
        scheduleDailyNotification();
      } else if (frequency === 'twice') {
        scheduleTwiceDailyNotification(interval);
      }
    } else {
      cancelNotifications();
    }
  }, [pushNotifications, frequency, interval]);

  // Notification registration and scheduling functions
  const registerForPushNotificationsAsync = async () => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Permission not granted', 'You need to allow notifications to use this feature.');
        return;
      }
      const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
      try {
        const pushTokenString = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        return pushTokenString;
      } catch (error) {
        console.error('Error getting push token:', error);
      }
    } else {
      Alert.alert('Error', 'Must use physical device for push notifications');
    }
  };

  // Save preferences to Firebase
  const savePreferences = async () => {
    await firestore().collection('users').doc(userUid).set({
      notificationPreferences: { frequency, interval },
    }, { merge: true });

    // Send a test notification after saving preferences
    sendNotification();
  };

  // Send a notification to the user
  const sendNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Preferences Updated",
          body: `Your will receive Daily Log reminders ${frequency} a day`,
        },
        trigger: {
          seconds: 1, // Show the notification after 1 second
        },
      });
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  // Schedule notification once daily
  const scheduleDailyNotification = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Pst! Your daily log awaits",
        body: 'Complete eco actions for a greener tomorrow',
      },
      trigger: {
        hour: 8,
        minute: 0,
        repeats: true,
      },
    });
  };

  // Schedule notification twice daily with an interval
  const scheduleTwiceDailyNotification = async (interval: number) => {
    // Schedule the first notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Pst! Your daily log awaits",
        body: 'Complete eco actions for a greener tomorrow',
      },
      trigger: {
        hour: 8,
        minute: 0,
        repeats: true,
      },
    });

    // Schedule the second notification after the specified interval
    const secondNotificationHour = (8 + interval) % 24;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Pst! Your daily log awaits",
        body: 'Complete eco actions for a greener tomorrow',
      },
      trigger: {
        hour: secondNotificationHour,
        minute: 0,
        repeats: true,
      },
    });
  };

    // Cancel all notifications
    const cancelNotifications = async () => {
      await Notifications.cancelAllScheduledNotificationsAsync();
    };

  const handleFreqSelection = async (freq: string) => {
    setFrequency(freq);
  }

  const handleIntervalSelection = async (interval: number) => {
    setInterval(interval);
  }

  return (
    <StyledLayout className="m-2 p-2">
      <StyledLayout className="mt-4 ml-2 mr-2 p-1 flex flex-row">
        <StyledText category="h6">Daily reminders</StyledText>
        <StyledToggle
          className="ml-auto"
          checked={pushNotifications}
          onChange={setPushNotifications}
        />
      </StyledLayout>

      {pushNotifications && (
        <>
          <StyledLayout className="p-2 m-1">
            <StyledLayout className="flex flex-row items-center justify-between">
              <StyledText category="s1">Frequency:</StyledText>
              <StyledSelect className='w-1/2' placeholder={"Select"}>
                <SelectItem title="Once Daily" onPress={() => handleFreqSelection("once")}/>
                <SelectItem title="Twice Daily" onPress={() => handleFreqSelection("twice")}/>
              </StyledSelect>
            </StyledLayout>

            {frequency === 'twice' && (
              <StyledLayout className="flex flex-row items-center justify-between">
                <StyledText category="s1">Interval:</StyledText>
                <StyledSelect className='w-1/2' placeholder={"Select"}>
                  <SelectItem title="Every 8 Hours" onPress={() => handleIntervalSelection(8)}/>
                  <SelectItem title="Every 12 Hours" onPress={() => handleIntervalSelection(12)}/>
                </StyledSelect>
              </StyledLayout>
            )}
          </StyledLayout>
        </>
      )}

      {/* Save preferences button */}
      <StyledButton onPress={savePreferences} status="primary">
        Save Preferences
      </StyledButton>
    </StyledLayout>
  );
};

export default Preferences;
