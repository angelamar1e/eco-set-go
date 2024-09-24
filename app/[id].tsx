import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Linking } from "react-native";
import { Card } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { useLocalSearchParams } from "expo-router";
import { EcoAction } from "@/types/EcoAction";
import { EcoArticle } from '../types/EcoArticle';

const EcoActionDetail = () => {
  const { id } = useLocalSearchParams();
  const actionId = id.toString();

  const [actionDetail, setActionDetail] = useState<EcoAction>();
  const [ecoFacts, setEcoFacts] = useState<EcoArticle[]>([]);

  const ecoActionDoc = firestore().collection('eco_actions').doc(actionId);
  const ecoFactsCollection = firestore().collection('eco_facts');

  useEffect(() => {
    const unsubscribeAction = ecoActionDoc.onSnapshot((doc) => {
        setActionDetail({
            id: doc.id,
            title: doc.data()!.title
        } as EcoAction)
      });

    const unsubscribeFacts = ecoFactsCollection
      .where(
        "article",
        "==",
        actionId
      )
      .onSnapshot((snapshot) => {
        const facts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as EcoArticle[];

        setEcoFacts(facts);
      });

    // Cleanup listeners on unmount
    return () => {
      unsubscribeAction();
      unsubscribeFacts();
    };
  }, [actionId]);

  if (!actionDetail) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderFactItem = ({ item }: { item: EcoArticle }) => (
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
    <View style={{ padding: 10 }}>
      <Card style={{ margin: 10 }}>
        <Card.Content>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>
            {actionDetail.title}
          </Text>
          {/* <Text style={{ marginTop: 5 }}>{actionDetail.description}</Text> */}
        </Card.Content>
      </Card>

      <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>
        Related Eco Facts:
      </Text>
      <FlatList
        data={ecoFacts}
        renderItem={renderFactItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default EcoActionDetail;
