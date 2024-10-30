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
  const [benefitsWithImages, setBenefitsWithImages] = useState<ArticleInfo[]>([]);
  const [instructionsWithImages, setInstructionsWithImages] = useState<ArticleInfo[]>([]);

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
      const fetchedBenefits = snapshot.docs.map((doc) => ({
        id: doc.id,
        content: doc.data().content,
        media: doc.data().element_url ? { uri: doc.data().element_url, type: undefined } : undefined,
      })) as ArticleInfo[];

      setBenefits(fetchedBenefits);
      loadImagesForBenefits(fetchedBenefits);
    });

    const unsubscribeInstructions = instructionsCollection.where("action", "==", actionId).onSnapshot((snapshot) => {
      const fetchedInstructions = snapshot.docs.map((doc) => ({
        id: doc.id,
        content: doc.data().content,
        media: doc.data().element_url ? { uri: doc.data().element_url, type: undefined } : undefined,
      })) as ArticleInfo[];
      setInstructions(fetchedInstructions);
      loadImagesForInstructions(fetchedInstructions);
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
        return { ...fact, media: { ...fact.media, uri: url } };
      }
      return fact;
    }));
    const validFactsWithImages = updatedFacts.filter(fact => fact.media?.uri !== null) as ArticleInfo[];
    setFactsWithImages(validFactsWithImages);
  };

  const loadImagesForBenefits = async (benefits: ArticleInfo[]) => {
    const updatedBenefits = await Promise.all(benefits.map(async (benefit) => {
      if (benefit.media) {
        const url = await loadImage(benefit.media.uri);
        return { ...benefit, media: { ...benefit.media, uri: url } };
      }
      return benefit;
    }));
    const validBenefitsWithImages = updatedBenefits.filter(benefit => benefit.media?.uri !== null) as ArticleInfo[];
    setBenefitsWithImages(validBenefitsWithImages);
  };

  const loadImagesForInstructions = async (instructions: ArticleInfo[]) => {
    const updatedInstructions = await Promise.all(instructions.map(async (instruction) => {
      if (instruction.media) {
        const url = await loadImage(instruction.media.uri);
        return { ...instruction, media: { ...instruction.media, uri: url } };
      }
      return instruction;
    }));
    const validInstructionsWithImages = updatedInstructions.filter(instruction => instruction.media?.uri !== null) as ArticleInfo[];
    setInstructionsWithImages(validInstructionsWithImages);
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
          className="w-40 m-2 self-end bg-lime-800"
          onPress={handleAddToLog}
        >
          Add to Daily Log
        </Button>
      </View>

          <StyledText category="s1" className="font-bold ml-2 mb-1">Facts</StyledText>
          <FlatList
            data={factsWithImages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <StyledLayout className="flex-row flex-1 items-center m-1 p-2 rounded-md border border-gray-200">
                {item.media && item.media.uri && (
                  <Image
                    source={{ uri: item.media.uri }}
                    className="w-20 h-20 rounded-md m-3"
                    accessibilityLabel="Fact Image"
                  />
                )}
                <StyledText category="c1" className="ml-2 mr-2 flex-shrink" >{item.content}</StyledText>
              </StyledLayout>
            )}
            showsVerticalScrollIndicator={false}
          />

          <StyledText category="s1" className="font-bold ml-2 mb-1">Benefits</StyledText>
          <FlatList
            data={benefitsWithImages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <StyledLayout className="flex-row flex-1 items-center m-1 p-2 rounded-md border border-gray-200">
                {item.media && item.media.uri && (
                  <Image
                    source={{ uri: item.media.uri }}
                    className="w-20 h-20 rounded-md m-3"
                    accessibilityLabel="Benefit Image"
                  />
                )}
                <StyledText category="c1" className="ml-2 mr-2 flex-shrink" >{item.content}</StyledText>
              </StyledLayout>
            )}
            showsVerticalScrollIndicator={false}
          />

      {/* Instructions section */}
      <StyledText category="s1" className="font-bold ml-2 mb-1">Instructions</StyledText>
      <FlatList
        data={instructionsWithImages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StyledLayout className="flex-row flex-1 items-center m-1 p-2 rounded-md border border-gray-200"> 
            {item.media && item.media.uri && (
              <Image
                source={{ uri: item.media.uri }}
                className="w-20 h-20 rounded-md m-3"
                accessibilityLabel="Instruction Image"
              />
            )}
            <StyledText category="c1" className="ml-2 mr-2 flex-shrink">{item.content}</StyledText>
          </StyledLayout>
        )}
        showsVerticalScrollIndicator={false}
      />


      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={2000}
      >
        Added to Daily Log
      </Snackbar>
    </StyledLayout>
  );
};

export default EcoActionDetail;
