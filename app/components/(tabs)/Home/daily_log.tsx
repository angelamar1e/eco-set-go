import React, { FC, useContext, useEffect, useState } from "react";
import { Card, Layout, Text, useTheme } from "@ui-kitten/components";
import { styled } from "nativewind";
import firestore from "@react-native-firebase/firestore";
import moment from "moment";
import { EcoAction } from "@/types/EcoAction";
import { getUserUid } from "@/app/utils/utils";

import DropdownEcoAction from './DropdownActionItem';
import ActionItem from './ActionItem';
import DoneItem from "./DoneItem";
import { EmissionsContext } from "@/contexts/EmissionsContext";
import { myTheme } from "@/constants/custom-theme";
import { FlatList, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const templates = [DropdownEcoAction, ActionItem];
const doneTemplates = [DoneItem];

const StyledLayout = styled(Layout);
const StyledText = styled(Text);
const StyledCard = styled(Card);

const DailyLog: FC = () => {
  const [userUid, setUserUid] = useState<string | undefined>();
  const [dailyLog, setDailyLog] = useState<EcoAction[]>([]);
  const [completedActions, setCompletedActions] = useState<EcoAction[]>([]);
  const [actionIds, setActionIds] = useState<string[]>([]);
  const [currentLog, setCurrentLog] = useState({});
  const [completedActionIds, setCompletedActionIds] = useState<{[key: string]: number}>({});

  const {overallFootprint, setOverallFootprint} = useContext(EmissionsContext);

  const currentDate = moment().format("YYYY-MM-DD");

  async function getCurrentLog(actionId: string) {
    const currentDate = moment().format("YYYY-MM-DD");

    const currentLog = (await userLogs.get()).data()?.[currentDate] || {};

    setCurrentLog(currentLog[actionId]);
  }

  useEffect(() => {
    const fetchUserUid = async () => {
      const uid = await getUserUid();
      setUserUid(uid);
    };
    fetchUserUid();
  }, []);

  const dailyLogDoc = firestore().collection("daily_logs").doc(userUid);
  const userLogs = firestore().collection("user_logs").doc(userUid);

  useEffect(() => {
    if (!userUid) return;

    const unsubscribeDailyLog = dailyLogDoc.onSnapshot((doc) => {
      const data = doc.data();
      if (data && data.action_ids) {
        setActionIds(data.action_ids);
      }
    });

    const unsubscribeUserLogs = userLogs.onSnapshot((doc) => {
      const data = doc.data();
      if (data && data[currentDate]) {
        setCompletedActionIds(data[currentDate]);
      }
    });

    return () => {
      unsubscribeDailyLog();
      unsubscribeUserLogs();
    };
  }, [userUid]);

  useEffect(() => {
    const fetchEcoActions = async () => {
      if (actionIds.length > 0) {
        const remainingActions = actionIds.filter((id) => !Object.keys(completedActionIds).includes(id));
        const actionsData = await getActionInfo(remainingActions);
        const completedActionsData = await getActionInfo(Object.keys(completedActionIds));

        setDailyLog(actionsData);
        setCompletedActions(completedActionsData);
      } else if (actionIds.length === 0) {
        setDailyLog([]);
      }
    };

    fetchEcoActions();
  }, [actionIds, completedActionIds]);

  async function getActionInfo(ids: string[]): Promise<EcoAction[]> {
    if (ids.length === 0) return [];
    const actionCollection = firestore().collection("eco_actions");
    const actionQuery = await actionCollection.where(firestore.FieldPath.documentId(), "in", ids).get();
    return actionQuery.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as EcoAction[];
  }

  const handleDelete = async (actionId: string) => {
    await dailyLogDoc.update({
      action_ids: firestore.FieldValue.arrayRemove(actionId),
    });
  };

  async function handleUnmark(actionId: string) {
    const currentDate = moment().format("YYYY-MM-DD");

    const currentLog = (await userLogs.get()).data()?.[currentDate] || {};

    // Remove the specific actionId from the map for the current date
    delete currentLog[actionId];

    await userLogs.update({
      [currentDate]: currentLog,
    });

    // const valueToRemove = currentLog[actionId] || 0; // Get the value for the actionId to subtract

    // updateTotalFootprint(-valueToRemove); // Subtract the value from total
  }

  async function handleComplete(actionId: string, selectedOptionValue: number) {
    const currentDate = moment().format("YYYY-MM-DD");

    // Fetch the existing log for the current date
    const currentLog = (await userLogs.get()).data()?.[currentDate] || {};

    // Update the specific actionId within the current date without overwriting other fields
    await userLogs.update({
      [currentDate]: {
        ...currentLog, // Keep the existing entries for the date
        [actionId]: selectedOptionValue, // Update the specific action
      },
    });

    // updateTotalFootprint(selectedOptionValue);
  }

  // Update total footprint
  const updateTotalFootprint = (change: number) => {
    setOverallFootprint((prevTotal: number) => prevTotal + change);
    // Update Firestore with new total footprint
    firestore().collection('current_footprint').doc(userUid).update({
      overall_footprint: firestore.FieldValue.increment(change), // Increment or decrement total footprint
    });
  };

  // Conditionally render the template based on the `template` field
  const renderItem = ({ item }: { item: EcoAction }) => {
    const ActionItemTemplate = templates[item.template];

    return (
      <ActionItemTemplate 
        item={item}
        completedActions={completedActions}
        handleDelete={handleDelete}
        handleComplete={handleComplete}
      />
    );
  };

  const renderDoneItem = ({ item }: { item: EcoAction }) => { 
    const DoneItemTemplate = DoneItem;

    return (
      <DoneItemTemplate 
        item={item}
        completedActions={completedActions}
        handleDelete={handleDelete}
        handleUnmark={handleUnmark}
        handleComplete={handleComplete}
      />
    );
  };

  const theme = useTheme();
  const headertextColor = theme['color-success-900'];

  return (
    <StyledLayout className="mt-4">
      <StyledLayout className="items-center">
        <View style={{ flexDirection: "row",}}>
          <StyledText category="h5" className="text-center mb-2" style={{ color: headertextColor }}>
            Daily Log
          </StyledText>
          <TouchableOpacity
            style={{ marginLeft: 8, 
            }}
            onPress={() => router.push('/(tabs)/Goal Setting/logs')}
          >
            <Ionicons name="pencil" color="#8F9BB3" size={18} />
          </TouchableOpacity>
        </View>
      </StyledLayout>

      <StyledCard className="rounded-lg">
        <StyledText category="s1" 
          style={{ 
            color: myTheme['color-success-900'], 
            fontWeight: 'bold', 
            marginBottom: 5
            }}
          >
          Actions To Do
        </StyledText>
        {dailyLog.length > 0 ? (
          <FlatList
            data={dailyLog}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <StyledText category="p2" style={{ textAlign: 'center', color: '#AAA' }}>No pending actions.</StyledText>
        )}
      </StyledCard>

        <StyledCard className="rounded-lg mb-2 mt-2">
          <StyledText category="s1" 
            style={{ 
              color: myTheme['color-success-900'], 
              fontWeight: 'bold', 
              marginBottom: 5
              }}
            >
            Actions Done
          </StyledText>
          {completedActions.length > 0 ? (
            <FlatList
              data={completedActions}
              renderItem={renderDoneItem}
              keyExtractor={(item) => item.id}
            />
          ) : (
            <StyledText category="p2" style={{ textAlign: 'center', color: '#AAA' }}>No actions completed yet.</StyledText>
          )}
        </StyledCard>
    </StyledLayout>
  );
};


export default DailyLog;
