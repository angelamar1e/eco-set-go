import React, { useState, useEffect, useRef } from "react";
import { Platform, Alert } from "react-native";
import {
  Toggle,
  Text,
  Layout,
  Button,
  Select,
  SelectItem,
  IndexPath,
} from "@ui-kitten/components";
import { styled } from "nativewind";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { useUserContext } from "@/contexts/UserContext";
import firestore from "@react-native-firebase/firestore";
import { myTheme } from "@/constants/custom-theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { handleLogOut } from "@/app/utils/utils";

const StyledText = styled(Text);
const StyledLayout = styled(Layout);
const StyledToggle = styled(Toggle);
const StyledButton = styled(Button);
const StyledSelect = styled(Select);

const Preferences: React.FC = () => {
  const { userUid, notification, name } = useUserContext();
  const [pushNotifications, setPushNotifications] = useState(
    notification ? true : false
  );
  const [expoPushToken, setExpoPushToken] = useState("");
  const selectedTime = new Date();
  selectedTime.setHours(8, 0, 0, 0); // Always set to 8:00 AM
  const [interval, setInterval] = useState<number>(12);
  const [frequency, setFrequency] = useState<string>("once");
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
 

  // Request notification permissions and set listeners
  useEffect(() => {
    (async () => {
      const token = await registerForPushNotificationsAsync();
      if (token) setExpoPushToken(token);
    })();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response received:", response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    if (notification) {
      setPushNotifications(true);
      setFrequency(notification.frequency);
      setInterval(notification.interval);
    }
  }, [notification]); // Add `notification` as a dependency if it can change
  
  // Effect to handle scheduling when preferences change
  useEffect(() => {
    if (pushNotifications) {
      if (frequency === "once") scheduleDailyNotification(selectedTime);
      else if (frequency === "twice")
        scheduleTwiceDailyNotification(selectedTime, interval);
    } else {
      // Cancel notifications but do not delete preferences immediately
      cancelNotifications();
    }
  }, [pushNotifications, frequency, interval, selectedTime]);
  
  // Effect to delete notification preferences when specifically required
  useEffect(() => {
    if (!pushNotifications) {
      firestore()
        .collection("users")
        .doc(userUid)
        .update({ notificationPreferences: firestore.FieldValue.delete() });
    }
  }, [pushNotifications]); // Run only when `pushNotifications` changes  

  // Register for push notifications
  const registerForPushNotificationsAsync = async (): Promise<
    string | undefined
  > => {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        Alert.alert(
          "Permission not granted",
          "You need to allow notifications to use this feature."
        );
        return;
      }

      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ??
        Constants.easConfig?.projectId;
      try {
        const token = (await Notifications.getExpoPushTokenAsync({ projectId }))
          .data;
        return token;
      } catch (error) {
        console.error("Error getting push token:", error);
      }
    } else {
      Alert.alert("Error", "Push notifications require a physical device.");
    }
  };

  // Save preferences and schedule notifications
  const savePreferences = async () => {
    try {
      const firstName = name.split(' ')[0];
      await firestore()
        .collection("users")
        .doc(userUid)
        .set(
          { notificationPreferences: { frequency, interval } },
          { merge: true }
        );

      // Cancel existing notifications and reschedule
      await cancelNotifications();
      if (pushNotifications) {
        if (frequency === "once") scheduleDailyNotification(selectedTime);
        else if (frequency === "twice")
          scheduleTwiceDailyNotification(selectedTime, interval);
      }

      const message = frequency === "once" ? `You will receive reminders once a day.` : `You will receive reminders ${frequency} a day, every ${interval} hours, starting at 8AM tomorrow.`

      sendNotification(
        "Preferences saved 🔔💚",
        message
      );
    } catch (error) {
      console.error(
        "Error saving preferences or scheduling notifications:",
        error
      );
    }
  };

  // Parse a Date object into hour and minute
  const parseTime = (time: Date) => ({
    hour: time.getHours(),
    minute: time.getMinutes(),
  });

  // Schedule daily notifications at a specific time
  const scheduleDailyNotification = async (time: Date) => {
    const firstName = name.split(' ')[0];
    const { hour, minute } = parseTime(time);

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Hi ${firstName} 🥰`,
          body: "yung daily log mo po pakigawa thanks",
        },
        trigger: { hour, minute, repeats: true },
      });
    } catch (error) {
      console.error("Error scheduling daily notification:", error);
    }
  };

  // Schedule twice-daily notifications based on interval
  const scheduleTwiceDailyNotification = async (
    startTime: Date,
    interval: number
  ) => {
    const firstName = name.split(' ')[0];
    const { hour: startHour, minute } = parseTime(startTime);

    try {
      // First notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Hi ${firstName} 🥰`,
          body: "yung daily log mo po pakigawa thanks!",
        },
        trigger: { hour: startHour, minute, repeats: true },
      });

      // Second notification after interval
      const secondHour = (startHour + interval) % 24;
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Hello ulit, ${firstName}!`,
          body: "Logging today means greener tomorrows 🍃 (and helping us graduate)",
        },
        trigger: { hour: secondHour, minute, repeats: true },
      });
    } catch (error) {
      console.error("Error scheduling twice-daily notifications:", error);
    }
  };

  // Cancel all notifications
  const cancelNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error("Error canceling notifications:", error);
    }
  };

  // Send immediate notification for confirmation
  const sendNotification = async (title: string, body: string) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: { title, body },
        trigger: { seconds: 1 },
      });
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  // Handle toggle change and request notification permissions if turning on
  const handleToggleChange = async (status: boolean) => {
    setPushNotifications(status);
    if (status) {
      await requestNotificationPermission();
    }
  };

  // Request notification permission on toggle
  const requestNotificationPermission = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        const { status: newStatus } =
          await Notifications.requestPermissionsAsync();
        if (newStatus !== "granted") {
          Alert.alert(
            "Permission not granted",
            "You need to allow notifications to use this feature."
          );
        }
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };

  return (
    <StyledLayout className="m-2 p-2">
      <StyledLayout
        className="flex-row justify-between p-3 rounded-2xl "
        style={{ backgroundColor: myTheme["color-success-600"] }}
      >
        <StyledText className="font-bold text-xl text-white">
          Daily Reminders
        </StyledText>
        <StyledToggle
          checked={pushNotifications}
          onChange={handleToggleChange}
        />
      </StyledLayout>

      {pushNotifications && (
        <StyledLayout className="p-3">
          <StyledLayout className="my-2">
            <StyledText className="text-lg mb-2 font-bold">
              Frequency
            </StyledText>
            <StyledSelect
              value={frequency === "once" ? "Once Daily" : "Twice Daily"}
              onSelect={(index) => {
                const singleIndex = index as IndexPath; // Explicitly cast to IndexPath
                setFrequency(singleIndex.row === 0 ? "once" : "twice");
              }}
              multiSelect={false} // Ensure single selection
            >
              <SelectItem title="Once Daily" />
              <SelectItem title="Twice Daily" />
            </StyledSelect>
          </StyledLayout>

          {frequency === "twice" && (
            <StyledLayout className="my-2">
              <StyledText className="text-lg mb-2 font-bold">
                Interval
              </StyledText>
              <StyledSelect
                value={`${interval} Hours`}
                onSelect={(index: IndexPath | IndexPath[]) => {
                  const selectedIndex = index as IndexPath;
                  setInterval(selectedIndex.row === 0 ? 8 : 12);
                }}
              >
                <SelectItem title="Every 8 Hours" />
                <SelectItem title="Every 12 Hours" />
              </StyledSelect>
            </StyledLayout>
          )}
          <StyledButton
            className="mt-10 rounded-lg w-1/2 ml-40"
            onPress={savePreferences}
          >
            Save Preferences
          </StyledButton>
        </StyledLayout>
      )}

<StyledLayout
        className="flex-row justify-center items-center mt-5"
        style={{
          bottom: 0,
          left: 0,
          right: 0,
          top: 20,
          borderTopColor: myTheme["color-success-900"],
        }}
      >
        <StyledLayout className="items-center">
          <Button
            style={{
              borderRadius: 100,
              marginHorizontal: 8,
              borderWidth: 1,
              paddingHorizontal: 15,
              paddingVertical: 10,
            }}
            onPress={() => router.push("/Profile/profile")}
          >
            <MaterialCommunityIcons name="arrow-left" size={20}>
              <Text
                category="label"
                className="items-center"
                style={{ color: "", textAlign: "center", fontSize: 16 }}
              >
                {" "}
                Go back{" "}
              </Text>
            </MaterialCommunityIcons>
          </Button>
        </StyledLayout>

        <StyledLayout className="">
          <Button
            style={{
              borderColor: myTheme["color-success-700"],
              borderRadius: 100,
              marginHorizontal: 8,
              borderWidth: 1,
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
            onPress={handleLogOut}
            appearance="ghost"
          >
            <MaterialCommunityIcons name="logout" size={18} color={""}>
              <Text
                category="label"
                className="items-center"
                style={{ color: "", textAlign: "center", fontSize: 16 }}
              >
                {" "}
                Log Out{" "}
              </Text>
            </MaterialCommunityIcons>
          </Button>
        </StyledLayout>
      </StyledLayout>
    </StyledLayout>
  );
};

export default Preferences;
