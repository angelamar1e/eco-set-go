import React, { useEffect, useState } from "react";
import { View, FlatList, Image } from "react-native";
import { Button, Snackbar } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { useLocalSearchParams } from "expo-router";
import { EcoAction } from "@/types/EcoAction";
import { ArticleInfo } from "../../../../types/ArticleInfo";
import { getUserUid } from "@/app/utils/utils";
import { styled } from "nativewind";
import { Text, Layout, Card } from "@ui-kitten/components";
import EcoActionHeader from "./EcoArticleDetailsHeader";
import storage from '@react-native-firebase/storage';

const StyledText = styled(Text);
const StyledLayout = styled(Layout);
const StyledCard = styled(Card);

const EcoActionDetail = () => {
  const { article } = useLocalSearchParams();
  const actionId = article.toString();

  const [userUid, setUserUid] = useState<string>();
  const [visible, setVisible] = useState(false);
  const [actionDetail, setActionDetail] = useState<EcoAction>();
  const [facts, setFacts] = useState<ArticleInfo[]>([]);
  const [benefits, setBenefits] = useState<ArticleInfo[]>([]);
  const [instructions, setInstructions] = useState<ArticleInfo[]>([]);
  const [factsWithImages, setFactsWithImages] = useState<ArticleInfo[]>([]);

  useEffect(() => {
    const fetchUserUid = async () => {
      const uid = await getUserUid();
      setUserUid(uid);
    };
    fetchUserUid();
  }, []);

  const ecoActionDoc = firestore().collection('eco_actions').doc(actionId);
  const factsCollection = firestore().collection('eco_facts');
  const benefitsCollection = firestore().collection('eco_benefits');
  const instructionsCollection = firestore().collection('eco_instructions');

  useEffect(() => {
    const unsubscribeAction = ecoActionDoc.onSnapshot((doc) => {
      setActionDetail({
        id: doc.id,
        title: doc.data()!.title,
      } as EcoAction);
    });

    const unsubscribeFacts = factsCollection.where("action", "==", actionId).onSnapshot((snapshot) => {
      const fetchedFacts = snapshot.docs.map((doc) => ({
        id: doc.id,
        content: doc.data().content,
        media: doc.data().element_url ? { uri: doc.data().element_url, type: undefined } : undefined,
      })) as ArticleInfo[];

      setFacts(fetchedFacts);
      loadImagesForFacts(fetchedFacts);
    });

    const unsubscribeBenefits = benefitsCollection.where("action", "==", actionId).onSnapshot((snapshot) => {
      setBenefits(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as ArticleInfo[]);
    });

    const unsubscribeInstructions = instructionsCollection.where("action", "==", actionId).onSnapshot((snapshot) => {
      setInstructions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as ArticleInfo[]);
    });

    return () => {
      unsubscribeAction();
      unsubscribeFacts();
      unsubscribeBenefits();
      unsubscribeInstructions();
    };
  }, [actionId]);

  const loadImagesForFacts = async (facts: ArticleInfo[]) => {
    const updatedFacts = await Promise.all(facts.map(async (fact) => {
      if (fact.media) {
        const url = await loadImage(fact.media.uri);
        // Return fact with updated media URI
        return { ...fact, media: { ...fact.media, uri: url } };
      }
      return fact; // Return unchanged fact if no media
    }));
  
    // Filter out facts where media.uri is null
    const validFactsWithImages = updatedFacts.filter(fact => fact.media?.uri !== null) as ArticleInfo[];
  
    setFactsWithImages(validFactsWithImages);
  };
  

  const loadImage = async (gsUrl: string): Promise<string | null> => {
    try {
      const ref = storage().refFromURL(gsUrl);
      return await ref.getDownloadURL();
    } catch (error) {
      console.error("Error fetching image URL: ", error);
      return null;
    }
  };

  const showSnackbar = () => setVisible(true);

  const handleAddToLog = () => {
    const dailyLogDoc = firestore().collection('daily_logs').doc(userUid);
    dailyLogDoc.update({
      action_ids: firestore.FieldValue.arrayUnion(actionId)
    });
    showSnackbar();
  };

  if (!actionDetail) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <StyledLayout className="flex-1 p-3">
      <EcoActionHeader />
      <View className="flex-column">
        <StyledText className="m-1" category="h6">
          {actionDetail.title}
        </StyledText>
        <Button
          icon="note-plus"
          mode="contained"
          className="w-40 m-3 self-end bg-lime-800"
          onPress={handleAddToLog}
        >
          Add to Daily Log
        </Button>
      </View>

      <StyledLayout className="flex-row">
        {/* First column with Facts */}
        <StyledLayout className="flex-1">
          <StyledText category="s1" className="font-bold ml-3 mb-1">Facts</StyledText>
          <FlatList
            data={factsWithImages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <StyledCard className="m-2">
                {item.media && item.media.uri && (
                  <Image
                    source={{ uri: item.media.uri }}
                    className="w-30 h-20 rounded-md m-2"
                    accessibilityLabel="Image"
                  />
                )}
                <StyledText category="c1">{item.content}</StyledText>
              </StyledCard>
            )}
            showsVerticalScrollIndicator={false}
          />
        </StyledLayout>

        {/* Second column with Benefits and Instructions */}
        <StyledLayout className="flex-1">
          <StyledText category="s1" className="font-bold ml-3 mb-1">Benefits</StyledText>
          <FlatList
            data={benefits}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <StyledCard className="m-2">
                <StyledText category="c1">{item.content}</StyledText>
              </StyledCard>
            )}
            showsVerticalScrollIndicator={false}
          />
          <StyledText category="s1" className="font-bold ml-3 mb-1">Instructions</StyledText>
          <FlatList
            data={instructions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <StyledCard className="m-2">
                <StyledText category="c1">{item.content}</StyledText>
              </StyledCard>
            )}
            showsVerticalScrollIndicator={false}
          />
        </StyledLayout>
      </StyledLayout>

      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={Snackbar.DURATION_SHORT}
        className="w-full"
      >
        Action added to your Daily Log
      </Snackbar>
    </StyledLayout>
  );
};

export default EcoActionDetail;
