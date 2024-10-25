import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform, Switch } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import DateTimePicker from '@react-native-community/datetimepicker';

// Notification Handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Send push notification function
async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Scheduled Reminder',
    body: 'This is your daily reminder!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

// Register for push notifications
async function registerForPushNotificationsAsync() {
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
      alert('Permission not granted to get push token for push notification!');
      return;
    }
    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    try {
      const pushTokenString = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      return pushTokenString;
    } catch (e) {
      console.error(e);
    }
  } else {
    alert('Must use physical device for push notifications');
  }
}

// Main Component
export default function Notification() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  // Request notification permissions and set listeners
  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? ''))
      .catch((error: any) => console.error(error));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // Handle daily notification scheduling
  const scheduleDailyNotification = async (time: Date) => {
    const trigger = new Date(time);
    trigger.setSeconds(0); // Set seconds to 0

    await Notifications.cancelAllScheduledNotificationsAsync(); // Cancel any existing scheduled notifications

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Daily Reminder',
        body: 'This is your scheduled daily reminder!',
      },
      trigger: {
        hour: trigger.getHours(),
        minute: trigger.getMinutes(),
        repeats: true, // Repeat daily
      },
    });
  };

  // Cancel all notifications
  const cancelNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  // Toggle notification switch
  const toggleNotificationSwitch = () => {
    setIsNotificationEnabled(previousState => !previousState);
    if (!isNotificationEnabled) {
      scheduleDailyNotification(selectedTime);
    } else {
      cancelNotifications();
    }
  };

  // Handle time picker change
  const onTimeChange = (event: any, selectedDate: any) => {
    const currentTime = selectedDate || selectedTime;
    setShowTimePicker(Platform.OS === 'ios');
    setSelectedTime(currentTime);
    if (isNotificationEnabled) {
      scheduleDailyNotification(currentTime); // Reschedule the notification with new time
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
      <Text>Your Expo push token: {expoPushToken}</Text>
      
      {/* Notification Switch */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text>Enable Daily Notifications</Text>
        <Switch
          onValueChange={toggleNotificationSwitch}
          value={isNotificationEnabled}
        />
      </View>

      {/* Time Picker */}
      {isNotificationEnabled && (
        <View>
          <Button title="Select Time" onPress={() => setShowTimePicker(true)} />
          <Text>Selected Time: {selectedTime.getHours()}:{selectedTime.getMinutes()}</Text>
          {showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onTimeChange}
            />
          )}
        </View>
      )}

      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title}</Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>

      <Button
        title="Send Test Notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      />
    </View>
  );
}