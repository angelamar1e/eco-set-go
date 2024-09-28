import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Linking } from "react-native";
import { Button, Card, Snackbar } from "react-native-paper";
import firestore, { arrayUnion } from "@react-native-firebase/firestore";
import { useLocalSearchParams } from "expo-router";
import { EcoAction } from "@/types/EcoAction";
import { ArticleInfo } from '../../../../types/ArticleInfo';
import { getUserUid } from "@/app/utils/utils";

const EcoActionDetail = () => {
  const { article } = useLocalSearchParams();
  const actionId = article.toString();

  const [userUid, setUserUid] = useState<string>();

  useEffect(() => {
    const fetchUserUid = async () => {
      const uid = await getUserUid();
      setUserUid(uid);
    };

    fetchUserUid();
  }, []);

  const [visible, setVisible] = useState(false);

  const [actionDetail, setActionDetail] = useState<EcoAction>();
  const [facts, setFacts] = useState<ArticleInfo[]>([]);
  const [benefits, setBenefits] = useState<ArticleInfo[]>([]);
  const [instructions, setInstructions] = useState<ArticleInfo[]>([]);

  const ecoActionDoc = firestore().collection('eco_actions').doc(actionId);
  const factsCollection = firestore().collection('eco_facts');
  const benefitsCollection = firestore().collection('eco_benefits');
  const instructionsCollection = firestore().collection('eco_instructions');

  useEffect(() => {
    const unsubscribeAction = ecoActionDoc.onSnapshot((doc) => {
        setActionDetail({
            id: doc.id,
            title: doc.data()!.title
        } as EcoAction)
      });

    const unsubscribeFacts = factsCollection
      .where(
        "action",
        "==",
        actionId
      )
      .onSnapshot((snapshot) => {
        const facts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ArticleInfo[];

        setFacts(facts);
      });

    const unsubscribeBenefits = benefitsCollection
    .where(
      "action",
      "==",
      actionId
    )
    .onSnapshot((snapshot) => {
      const benefits = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ArticleInfo[];

      setBenefits(benefits);
    });

    const unsubscribeInstructions = instructionsCollection
    .where(
      "action",
      "==",
      actionId
    )
    .onSnapshot((snapshot) => {
      const instructions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ArticleInfo[];

      setInstructions(instructions);
    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribeAction();
      unsubscribeFacts();
      unsubscribeBenefits();
      unsubscribeInstructions();
    };
  }, [actionId]);

  if (!actionDetail) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  const showSnackbar = () => {

    setVisible(true);
  };

  const handleAddToLog = () => {
    const dailyLogDoc = firestore().collection('daily_logs').doc(userUid);

    dailyLogDoc.update({
        action_ids: firestore.FieldValue.arrayUnion(actionId)
    })

    showSnackbar();
  }

  const renderFactItem = ({ item }: { item: ArticleInfo }) => (
    <Card style={{ margin: 10 }}>
      <Card.Content>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.content}</Text>
        {item.element_url && (
          <Text
            style={{ color: "blue" }}
            // onPress={() => Linking.openURL(item.element_url)}
          >
            More Info
          </Text>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={{ padding: 10 }} className="flex-1 flex-column justify-start">
      <View className="flex-column">
          <Text className="font-bold text-2xl">
            {actionDetail.title} </Text>
        <Button icon="note-plus" mode="contained" className="w-42 m-3 self-end" onPress={handleAddToLog}>Add to Daily Log</Button>
      </View>

      <Text className="text-center" style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>
        Facts
      </Text>
      <FlatList
        data={facts}
        renderItem={renderFactItem}
        keyExtractor={(item) => item.id}
        className="max-h-20"
      />

      <Text className="text-center" style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>
        Benefits
      </Text>
      <FlatList
        data={benefits}
        renderItem={renderFactItem}
        keyExtractor={(item) => item.id}
        className="max-h-20"
      />

    <Text className="text-center" style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>
        Instructions
      </Text>
      <FlatList
        data={instructions}
        renderItem={renderFactItem}
        keyExtractor={(item) => item.id}
        className="max-h-20"
      />
      
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={Snackbar.DURATION_SHORT} // Optional, set a duration if you want
      className="w-full"
      >
        Action added to your Daily Log
      </Snackbar>
    </View>
  );
};

export default EcoActionDetail;
