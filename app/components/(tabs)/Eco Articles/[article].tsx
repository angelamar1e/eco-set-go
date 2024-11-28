import React, { useEffect, useState } from "react";
import { View, FlatList, Image, ActivityIndicator, useColorScheme } from "react-native";
import { Button, Snackbar } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { useLocalSearchParams } from "expo-router";
import { EcoAction } from "@/types/EcoAction";
import { ArticleInfo } from "../../../../types/ArticleInfo";
import { styled } from "nativewind";
import { Text, Layout } from "@ui-kitten/components";
import storage from '@react-native-firebase/storage';
import BackButton from "./BackButton";
import { useUserContext } from "@/contexts/UserContext";

const StyledText = styled(Text);
const StyledLayout = styled(Layout);

const cache: { [key: string]: string } = {}; // In-memory cache for image URLs

const EcoActionDetail = () => {
  const { article } = useLocalSearchParams();
  const actionId = article.toString();
  const { userUid } = useUserContext();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for complete data load
  const [actionDetail, setActionDetail] = useState<EcoAction>();
  const [facts, setFacts] = useState<ArticleInfo[]>([]);
  const [benefits, setBenefits] = useState<ArticleInfo[]>([]);
  const [instructions, setInstructions] = useState<ArticleInfo[]>([]);
  const [factsWithImages, setFactsWithImages] = useState<ArticleInfo[]>([]);

  const ecoActionDoc = firestore().collection('eco_actions').doc(actionId);
  const factsCollection = firestore().collection('eco_facts');
  const benefitsCollection = firestore().collection('eco_benefits');
  const instructionsCollection = firestore().collection('eco_instructions');

  const scheme = useColorScheme(); // Detect system theme (light/dark mode)

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

    // Once all images are loaded, set loading to false
    if (validFactsWithImages.length === facts.length) {
      setLoading(false);
    }
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

  const borderColor = scheme === 'dark' ? 'border border-black' : 'border border-gray-200';

  // List Header Component for static content
  const ListHeader = () => (
    <StyledLayout className="p-1">
      <BackButton />
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
        <StyledText 
          className="m-1 text-center" 
          style={{ fontFamily: 'Poppins-SemiBold', fontSize: 18 }}
        >
          {actionDetail.title}
        </StyledText>
        <StyledLayout className="flex-row justify-between m-2">
          <Button 
            icon="star" 
            mode="contained" 
            className="w-30 mx-1"
            buttonColor={scheme === 'dark' ? '#2E7D32' : '#34C759'}
            labelStyle={{ fontFamily: 'Poppins-Medium', fontSize: 14 }}
          >
            Points
          </Button>
          <Button 
            icon="note-plus" 
            mode="contained" 
            className="w-40 mx-1"
            buttonColor={scheme === 'dark' ? '#2E7D32' : '#34C759'}
            onPress={handleAddToLog}
            labelStyle={{ fontFamily: 'Poppins-Medium', fontSize: 14 }}
          >
            Add to Daily Log
          </Button>
        </StyledLayout>
      </StyledLayout>
    </StyledLayout>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <StyledLayout className="ml-2">
      <StyledText 
        className="flex-row items-center"
        style={{ 
          fontFamily: 'Poppins-SemiBold', 
          fontSize: 16,
        }}
      >
        {title}
      </StyledText>
    </StyledLayout>
  );

  return (
    <StyledLayout className="flex-1">
      <FlatList
      data={[
        { type: 'Facts', data: facts, emoji: "🔍" },
        { type: 'Benefits', data: benefits, emoji: "💡" },
        { type: 'Instructions', data: instructions, emoji: "📝" }
      ]}
      keyExtractor={(item) => item.type}
      ListHeaderComponent={ListHeader}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <StyledLayout>
          {/* Section Header */}
          <SectionHeader title={item.type} />
          {/* Display the items in the current section */}
          {item.data.map((contentItem) => (
            <StyledLayout
              key={contentItem.id}
              className={`flex-row items-start p-2 m-2 mb-4 rounded-md shadow-lg ${borderColor}`}
            >
              <StyledText 
                category="h5" 
                className="mr-1 flex-shrink"
                style={{ fontFamily: 'Poppins-Regular', fontSize: 16 }}
              >
                {item.emoji}
              </StyledText>
              <StyledText 
                category="p2" 
                className="ml-2 mr-2 flex-shrink"
                style={{ fontFamily: 'Poppins-Regular', fontSize: 13 , textAlign: 'justify'}}
              >
                {contentItem.content}
              </StyledText>
            </StyledLayout>
          ))}
        </StyledLayout>
      )}
    />
    </StyledLayout>
    
  );
};

export default EcoActionDetail;
