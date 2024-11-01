import React, { useEffect, useState } from "react";
import { View, FlatList, Image, ActivityIndicator } from "react-native";
import { Button, Snackbar } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { useLocalSearchParams } from "expo-router";
import { EcoAction } from "@/types/EcoAction";
import { ArticleInfo } from "../../../../types/ArticleInfo";
import { getUserUid } from "@/app/utils/utils";
import { styled } from "nativewind";
import { Text, Layout } from "@ui-kitten/components";
import storage from '@react-native-firebase/storage';
import BackButton from "./BackButton";

const StyledText = styled(Text);
const StyledLayout = styled(Layout);

const cache: { [key: string]: string } = {}; // In-memory cache for image URLs

const EcoActionDetail = () => {
  const { article } = useLocalSearchParams();
  const actionId = article.toString();

  const [userUid, setUserUid] = useState<string>();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for complete data load
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
    const fetchData = async () => {
      // Fetching data in parallel
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
        loadImagesForFacts(fetchedFacts); // Parallel load for images
      });

      const unsubscribeBenefits = benefitsCollection.where("action", "==", actionId).onSnapshot((snapshot) => {
        const fetchedBenefits = snapshot.docs.map((doc) => ({
          id: doc.id,
          content: doc.data().content,
        })) as ArticleInfo[];
        setBenefits(fetchedBenefits);
      });

      const unsubscribeInstructions = instructionsCollection.where("action", "==", actionId).onSnapshot((snapshot) => {
        const fetchedInstructions = snapshot.docs.map((doc) => ({
          id: doc.id,
          content: doc.data().content,
        })) as ArticleInfo[];
        setInstructions(fetchedInstructions);
      });

      setLoading(false); // Set loading to false after fetching all data
      return () => {
        unsubscribeAction();
        unsubscribeFacts();
        unsubscribeBenefits();
        unsubscribeInstructions();
      };
    };

    fetchData();
  }, [actionId]);

  const loadImagesForFacts = async (facts: ArticleInfo[]) => {
    const updatedFacts = await Promise.all(
      facts.map(async (fact) => {
        if (fact.media?.uri) {
          const cachedUrl = await loadImage(fact.media.uri);
          return { ...fact, media: { ...fact.media, uri: cachedUrl as string } };
        }
        return fact;
      })
    );

    const validFactsWithImages = updatedFacts.filter(
      (fact): fact is ArticleInfo => fact.media?.uri !== null
    );

    setFactsWithImages(validFactsWithImages);
  };

  const loadImage = async (gsUrl: string) => {
    if (cache[gsUrl]) return cache[gsUrl];

    try {
      const ref = storage().refFromURL(gsUrl);
      const url = await ref.getDownloadURL();
      cache[gsUrl] = url;
      return url;
    } catch (error) {
      console.error("Error fetching image URL:", error);
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

  if (loading || !actionDetail) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#34C759" />
      </View>
    );
  }

  return (
    <StyledLayout className="flex-1">
      <StyledLayout className="p-1 rounded-b-3xl border border-gray-200">
        <BackButton/>

        {factsWithImages.length > 0 && factsWithImages[0].media?.uri && (
          <Image
            source={{ uri: factsWithImages[0].media.uri }}
            style={{
              width: '80%', 
              aspectRatio: 16 / 9, 
              resizeMode: 'contain', 
              alignSelf: 'center'
            }}
          />
        )}

        {/* Title and Button Section */}
        <StyledLayout className="items-center">
          <StyledText className="m-1 text-center" category="h6">
            {actionDetail.title}
          </StyledText>

          <StyledLayout className="flex-row justify-between m-2">
            <Button icon="star" mode="contained" className="w-30 bg-lime-800 mx-1">
              Points
            </Button>
            <Button icon="note-plus" mode="contained" className="w-40 bg-lime-800 mx-1" onPress={handleAddToLog}>
              Add to Daily Log
            </Button>
          </StyledLayout>
        </StyledLayout>
      </StyledLayout>

      {/* Facts, Benefits, Instructions Sections */}
      <StyledLayout className="p-1 m-2">
        <StyledText category="s1" className="font-bold ml-2 mb-1">Facts</StyledText>
        <FlatList
          data={factsWithImages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <StyledLayout className="flex-row flex-1 items-start m-1 p-2 bg-gray-100 rounded-md shadow-lg">
              <StyledText category="h5" className="ml-2 mr-2">🔍</StyledText>
              <StyledText category="p2" className="ml-2 mr-2 flex-shrink">{item.content}</StyledText>
            </StyledLayout>
          )}
          showsVerticalScrollIndicator={false}
        />

        <StyledText category="s1" className="font-bold ml-2 mb-1">Benefits</StyledText>
        <FlatList
          data={benefits}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <StyledLayout className="flex-row flex-1 items-start m-1 p-2 bg-gray-100 rounded-md shadow-lg">
              <StyledText category="h5" className="ml-2 mr-2">🌟</StyledText>
              <StyledText category="p2" className="ml-2 mr-2 flex-shrink">{item.content}</StyledText>
            </StyledLayout>
          )}
          showsVerticalScrollIndicator={false}
        />

        <StyledText category="s1" className="font-bold ml-2 mb-1">Instructions</StyledText>
        <FlatList
          data={instructions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <StyledLayout className="flex-row flex-1 items-start m-1 p-2 bg-gray-100 rounded-md shadow-lg">
              <StyledText category="h5" className="ml-2 mr-2">📝</StyledText>
              <StyledText category="p2" className="ml-2 mr-2 flex-shrink">{item.content}</StyledText>
            </StyledLayout>
          )}
          showsVerticalScrollIndicator={false}
        />
      </StyledLayout>

      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={Snackbar.DURATION_SHORT}
      >
        Added to Daily Log!
      </Snackbar>
    </StyledLayout>
  );
};

export default EcoActionDetail;
