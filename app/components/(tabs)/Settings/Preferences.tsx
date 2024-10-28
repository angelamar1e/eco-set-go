import React, { useState, useEffect, useRef } from 'react';
import { Platform, Alert } from 'react-native';
import { Toggle, Text, Layout, Button } from '@ui-kitten/components';
import { styled } from 'nativewind';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Divider } from 'react-native-paper';

const StyledText = styled(Text);
const StyledLayout = styled(Layout);
const StyledToggle = styled(Toggle);
const StyledButton = styled(Button);

const Preferences: React.FC = () => {
  const [pushNotifications, setPushNotifications] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
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
      scheduleDailyNotification(selectedTime);
    } else {
      cancelNotifications();
    }
  }, [pushNotifications]);

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

  const scheduleDailyNotification = async (time: Date) => {
    const trigger = new Date(time);
    trigger.setSeconds(0);

    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Daily Reminder',
        body: 'This is your scheduled daily reminder!',
      },
      trigger: {
        hour: trigger.getHours(),
        minute: trigger.getMinutes(),
        repeats: true,
      },
    });
  };

  const cancelNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  // Time picker change handler
  const onTimeChange = (event: any, selectedDate: Date | undefined) => {
    setShowTimePicker(false); // Hide time picker after selecting time
    if (selectedDate && selectedDate.getTime() !== selectedTime.getTime()) {
      setSelectedTime(selectedDate);
      if (pushNotifications) {
        scheduleDailyNotification(selectedDate);
      }
    }
  };

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
      <StyledLayout className="p-2 m-1">
        <StyledLayout className="flex flex-row items-center justify-between">
          <StyledText category="s1">Selected Time:</StyledText>
          <StyledButton 
            className="rounded-full" 
            status='basic'
            size="small"
            onPress={() => setShowTimePicker(true)}
          >
            Edit Time
          </StyledButton>
        </StyledLayout>

        {/* Separate row for displaying the selected time */}
        <StyledLayout className="mt-2">
          <StyledText category="h6">{selectedTime.getHours()}:{selectedTime.getMinutes().toString().padStart(2, '0')}</StyledText>
        </StyledLayout>

        {/* Time Picker */}
        {showTimePicker && (
          <StyledLayout className="mt-2">
            <DateTimePicker
              value={selectedTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onTimeChange}
            />
          </StyledLayout>
        )}
      </StyledLayout>
    )}
      
    </StyledLayout>
  );
};

export default Preferences;