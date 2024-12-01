import React, { useState, useEffect, useRef, forwardRef } from "react";
import { Platform, Alert, Linking, TouchableOpacity } from 'react-native';
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

const setupNotificationChannels = async () => {
  if (Platform.OS === "android") {
    // Daily reminders channel
    await Notifications.setNotificationChannelAsync("daily-reminders", {
      name: "Daily Reminders",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default",
      enableVibrate: true,
      vibrationPattern: [0, 250, 250, 250],
    });

    // Community posts channel
    await Notifications.setNotificationChannelAsync("community-posts", {
      name: "Community Posts",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default",
      enableVibrate: true,
      vibrationPattern: [0, 500, 500, 500],
    });
  }
};

export const sendNotification = async (
  title: string,
  body: string,
  channelId: string
) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: "default",
        vibrate: [0, 250, 250, 250],
      },
      trigger: null,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

const Preferences: React.FC = () => {
  const { userUid, remindersPreferences, postsPreferences, name } =
    useUserContext();
  const [reminderNotifications, setReminderNotifications] =
    useState<boolean>(false);
  const [communityPostNotifications, setCommunityPostNotifications] =
    useState<boolean>(false);
  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const selectedTime = new Date();
  selectedTime.setHours(8, 0, 0, 0);
  const [interval, setInterval] = useState(8);
  const [frequency, setFrequency] = useState("twice");

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const registerForPushNotificationsAsync = async (): Promise<
    string | undefined
  > => {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("community-posts", {
        name: "Community Posts",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
        enableVibrate: true,
        vibrationPattern: [0, 500, 500, 500],
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
        await firestore().collection("users").doc(userUid).set(
          { expoPushToken: token },
          { merge: true } // Avoid overwriting existing fields
        );
        return token;
      } catch (error) {
        console.error("Error getting push token:", error);
      }
    } else {
      Alert.alert("Error", "Push notifications require a physical device.");
    }
  };

  useEffect(() => {
    (async () => {
      await setupNotificationChannels();
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
    console.log({ frequency, interval });
  }, [frequency, interval]);

  useEffect(() => {
    const reflectSavedPreference = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (remindersPreferences && status === "granted") {
        setReminderNotifications(true);
        setFrequency(remindersPreferences.frequency); // Fallback to default
        setInterval(remindersPreferences.interval); // Fallback to default
      }
      if (postsPreferences && status === "granted") {
        setCommunityPostNotifications(postsPreferences);
      }
    };

    reflectSavedPreference();
  }, []);

  const handleFrequencySelect = (index: IndexPath | IndexPath[]) => {
    if (index instanceof IndexPath) {
      setFrequency(index.row === 0 ? "once" : "twice");
    } else if (Array.isArray(index)) {
      setFrequency(index[0].row === 0 ? "once" : "twice");
    }
  };

  const handleIntervalSelect = (index: IndexPath | IndexPath[]) => {
    if (index instanceof IndexPath) {
      setInterval([1, 2, 3, 4, 6, 12][index.row]);
    } else if (Array.isArray(index)) {
      setInterval([1, 2, 3, 4, 6, 12][index[0].row]);
    }
  };

  const savePreferences = async () => {
    requestNotificationPermission();
    const message =
      frequency === "once"
        ? "once a day."
        : interval != 1
        ? `twice a day, every ${interval} hours.`
        : `twice a day, every 1 hour.`;

    if (reminderNotifications) {
      try {
        await firestore()
          .collection("users")
          .doc(userUid)
          .set(
            {
              remindersPreferences: {
                status: reminderNotifications,
                frequency,
                interval,
              },
            },
            { merge: true }
          );

        await cancelNotifications("daily-reminders");

        if (frequency === "once") scheduleDailyNotification(selectedTime);
        else if (frequency === "twice")
          scheduleTwiceDailyNotification(selectedTime, interval);

        sendNotification(
          "Daily Log Alerts 📣",
          `Your daily reminders are set to ${message}`,
          "daily-reminders"
        );
      } catch (error) {
        console.log(frequency, interval);
        console.error(
          "Error saving preferences or scheduling notifications:",
          error
        );
      }
    } else {
      cancelNotifications("daily-reminders");
      await firestore().collection("users").doc(userUid).update({
        remindersPreferences: firestore.FieldValue.delete(),
      });
    }

    if (communityPostNotifications) {
      try {
        await firestore().collection("users").doc(userUid).set(
          {
            postsNotificationsEnabled: communityPostNotifications,
          },
          { merge: true }
        );

        sendNotification(
          "Community Posts Alert 📣",
          `Post notifications are enabled.`,
          "community-posts"
        );
      } catch (error) {
        console.error(
          "Error saving preferences or scheduling notifications:",
          error
        );
      }
    } else {
      cancelNotifications("community-posts");
      await firestore().collection("users").doc(userUid).update({
        postsNotificationsEnabled: firestore.FieldValue.delete(),
      });
    }

    Alert.alert(
      "Preferences saved 💚",
      "Your notification preferences were saved successfully."
    );
  };

  const parseTime = (time: Date) => ({
    hour: time.getHours(),
    minute: time.getMinutes(),
  });

  const scheduleDailyNotification = async (time: Date) => {
    const firstName = name.split(" ")[0];
    const { hour, minute } = parseTime(time);

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Hi ${firstName} 🥰`,
          body: "yung daily log mo po pakigawa thanks!",
        },
        trigger: { hour, minute, repeats: true },
      });
    } catch (error) {
      console.error("Error scheduling daily notification:", error);
    }
  };

  const scheduleTwiceDailyNotification = async (
    startTime: Date,
    interval: number
  ) => {
    const firstName = name.split(" ")[0];
    const { hour: startHour, minute } = parseTime(startTime);

    for (let i = 0; i < 2; i++) {
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `Hi ${firstName} 🥰`,
            body: "yung daily log mo po pakigawa thanks!",
          },
          trigger: {
            hour: startHour + i * interval,
            minute,
            repeats: true,
          },
        });
      } catch (error) {
        console.error("Error scheduling twice-daily notification:", error);
      }
    }
  };

  const cancelNotifications = async (channelId: string) => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error(
        `Error canceling notifications for channel ${channelId}:`,
        error
      );
    }
  };

  const requestNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Notification permission required",
        "To continue, please grant notification permissions in your settings."
      );
    }
  };

  // Handle toggle change and request notification permissions if turning on
  const handleReminderToggleChange = async (status: boolean) => {
    setReminderNotifications(status);
    if (status) {
      await requestNotificationPermission();
    }
  };

  // Handle toggle change and request notification permissions if turning on
  const handlePostsToggleChange = async (status: boolean) => {
    setCommunityPostNotifications(status);
    if (status) {
      await requestNotificationPermission();
    }
  };

  return (
    <StyledLayout className="m-2 p-2">
      <TouchableOpacity
        className="w-1/2 rounded-full"
        onPress={savePreferences}
        style={{
          backgroundColor: myTheme["color-success-700"],
          marginTop: 10,
          marginBottom: 10,
          marginLeft: 'auto',
          marginRight: 'auto',
          width: "auto",
          height: "auto",
        }}
      >
        <StyledText style={{ fontFamily: "Poppins-Bold"}} className="text-white p-3">
          📩 Save Preferences
        </StyledText>
      </TouchableOpacity>
      <StyledLayout
        className="flex-row justify-between p-3 rounded-2xl "
        style={{ backgroundColor: myTheme["color-success-600"] }}
      >
        <StyledText className="font-bold text-lg text-white">
          Daily Log Reminders
        </StyledText>
        <StyledToggle
          checked={reminderNotifications}
          onChange={handleReminderToggleChange}
        />
      </StyledLayout>

      {reminderNotifications && (
        <StyledLayout className="p-3">
          <StyledLayout className="my-2">
            <StyledText className="text font-bold">Frequency</StyledText>
            <StyledSelect
              value={frequency === "once" ? "Once daily" : "Twice daily"}
              onSelect={(index: IndexPath | IndexPath[]) => {
                const singleIndex = index as IndexPath;
                setFrequency(singleIndex.row === 0 ? "once" : "twice"); // Explicitly handle mapping
              }}
            >
              <SelectItem title="Once daily" />
              <SelectItem title="Twice daily" />
            </StyledSelect>
          </StyledLayout>
          {frequency === "twice" && (
            <StyledLayout className="my-2">
              <StyledText className="text-lg font-bold">Interval</StyledText>
              <StyledSelect
                value={
                  interval != 1 ? `Every ${interval} hours` : "Every 1 hour"
                } // Fixing the displayed value
                onSelect={(index: IndexPath | IndexPath[]) => {
                  const selectedIndex = index as IndexPath;
                  setInterval([1, 2, 3, 4, 6, 8, 12][selectedIndex.row]); // Map selected index to the correct interval value
                }}
              >
                {[1, 2, 3, 4, 6, 12].map((option) => (
                  <SelectItem
                    key={option}
                    title={
                      option === 1 ? "Every 1 hour" : `Every ${option} hours`
                    }
                  />
                ))}
              </StyledSelect>
            </StyledLayout>
          )}
        </StyledLayout>
      )}

      <StyledLayout
        className="flex-row justify-between p-3 mt-2 rounded-2xl"
        style={{ backgroundColor: myTheme["color-success-600"] }}
      >
        <StyledText className="font-bold text-lg text-white">
          Community Post Notifications
        </StyledText>
        <StyledToggle
          checked={communityPostNotifications}
          onChange={handlePostsToggleChange}
        />
      </StyledLayout>

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
