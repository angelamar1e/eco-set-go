import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Image,
  ActivityIndicator,
  useColorScheme,
  Dimensions,
  Linking,
  Touchable,
  TouchableOpacity,
} from "react-native";
import { Button, Snackbar } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { Link, useLocalSearchParams } from "expo-router";
import storage from "@react-native-firebase/storage";
import { styled } from "nativewind";
import { Text, Layout } from "@ui-kitten/components";
import BackButton from "./BackButton";
import { useUserContext } from "@/contexts/UserContext";
import { EcoAction } from "@/types/EcoAction";
import { ArticleInfo } from "@/types/ArticleInfo";
import { myTheme } from "@/constants/custom-theme";
import { Points } from "@/constants/Points";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const StyledText = styled(Text);
const StyledLayout = styled(Layout);
const { height: screenHeight } = Dimensions.get("window");

const cache: { [key: string]: string } = {}; // In-memory cache for image URLs

// Define the type for recipe categories
type RecipeCategory =
  | "beef"
  | "pork"
  | "chicken"
  | "fish"
  | "vegetarian"
  | "vegan";

// Define the recipes object with the correct type
const recipes: Record<
  RecipeCategory,
  { icon: string; title: string; link: string }
> = {
  beef: {
    icon: "🥩",
    title: "Beef",
    link: "",
  },
  pork: {
    icon: "🥩",
    title: "Pork Recipes | Panlasang Pinoy",
    link: "https://panlasangpinoy.com/categories/recipes/pork-recipes/",
  },
  chicken: {
    icon: "🍗",
    title: "Chicken Recipes | Panlasang Pinoy",
    link: "https://panlasangpinoy.com/categories/recipes/chicken-recipes/",
  },
  fish: {
    icon: "🐟",
    title: "Fish Recipes | Panlasang Pinoy",
    link: "https://panlasangpinoy.com/categories/recipes/fish-recipes-recipes/",
  },
  vegetarian: {
    icon: "🧀",
    title: "15 Vegetarian Filipino Recipes You Need To Try | Women Chefs",
    link: "https://womenchefs.org/vegetarian-filipino-recipes/",
  },
  vegan: {
    icon: "🥗",
    title: "15 Vegan Versions of Classic Filipino Dishes | PETA",
    link: "https://www.peta.org/living/food/vegan-filipino-recipes/",
  },
};

// Define carbon emissions with the same type
const carbonEmissionsRank: Record<RecipeCategory, number> = {
  beef: 6,
  pork: 5,
  chicken: 4,
  fish: 3,
  vegetarian: 2,
  vegan: 1,
};

const openLink = (url: string) => {
  Linking.openURL(url).catch((err) =>
    console.error("Failed to open URL:", err)
  );
};

const EcoActionDetail = () => {
  const { article } = useLocalSearchParams();
  const actionId = article.toString();
  const { userUid } = useUserContext();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionDetail, setActionDetail] = useState<EcoAction>();
  const [facts, setFacts] = useState<ArticleInfo[]>([]);
  const [benefits, setBenefits] = useState<ArticleInfo[]>([]);
  const [instructions, setInstructions] = useState<ArticleInfo[]>([]);
  const [image, setImage] = useState<string | null>(null);

  const ecoActionDoc = firestore().collection("eco_actions").doc(actionId);
  const factsCollection = firestore().collection("eco_facts");
  const benefitsCollection = firestore().collection("eco_benefits");
  const instructionsCollection = firestore().collection("eco_instructions");

  const scheme = useColorScheme(); // Detect system theme (light/dark mode)

  const vh = (percentage: number) => (screenHeight * percentage) / 100;

  useEffect(() => {
    // Fetch main action details
    const unsubscribeAction = ecoActionDoc.onSnapshot(async (doc) => {
      if (doc.exists) {
        const data = doc.data();
        setActionDetail({ id: doc.id, ...data } as EcoAction);

        if (data?.image) {
          const imageUrl = await loadImage(data.image);
          setImage(imageUrl);
        }
        setLoading(false);
      }
    });

    // Fetch facts, benefits, and instructions
    const unsubscribeFacts = factsCollection
      .where("action", "==", actionId)
      .onSnapshot((snapshot) =>
        setFacts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as ArticleInfo[]
        )
      );

    const unsubscribeBenefits = benefitsCollection
      .where("action", "==", actionId)
      .onSnapshot((snapshot) =>
        setBenefits(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as ArticleInfo[]
        )
      );

    const unsubscribeInstructions = instructionsCollection
      .where("action", "==", actionId)
      .onSnapshot((snapshot) =>
        setInstructions(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as ArticleInfo[]
        )
      );

    return () => {
      unsubscribeAction();
      unsubscribeFacts();
      unsubscribeBenefits();
      unsubscribeInstructions();
    };
  }, [actionId]);

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

  const handleAddToLog = async () => {
    try {
      const dailyLogDoc = firestore().collection("daily_logs").doc(userUid);
      await dailyLogDoc.update({
        action_ids: firestore.FieldValue.arrayUnion(actionId),
      });
      setVisible(true);
    } catch (error) {
      console.error("Error updating daily log:", error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#34C759" />
      </View>
    );
  }

  const borderColor =
    scheme === "dark" ? "border border-black" : "border border-gray-200";

  const ListHeader = () => (
    <StyledLayout className="p-1">
      <BackButton />
      {image && (
        <Image
          className="mt-4"
          source={{ uri: image }}
          style={{
            width: "90%",
            borderRadius: 20,
            aspectRatio: 16 / 9,
            resizeMode: "contain",
            alignSelf: "center",
          }}
        />
      )}
      <StyledLayout className="items-center mt-5">
        <StyledText
          className="text-center"
          style={{
            color: myTheme["color-success-700"],
            fontFamily: "Poppins-Bold",
            fontSize: 20,
          }}
        >
          {actionDetail?.title}
        </StyledText>
        {!(actionDetail?.category === 'QC Initiatives') && (
        <StyledLayout className="flex-row justify-between m-2">
          <Button
            icon="star"
            mode="contained"
            className="w-30 mx-1"
            style={{ backgroundColor: myTheme["color-success-700"] }}
          >
            {actionId in Points[100] ? (
              <StyledText className="text-white font-bold">
                100 Points
              </StyledText>
            ) : (
              <StyledText className="text-white font-bold">
                200 Points
              </StyledText>
            )}
          </Button>
          <Button
            icon="note-plus"
            mode="contained"
            className="w-52 mx-1"
            onPress={handleAddToLog}
            style={{ backgroundColor: myTheme["color-success-700"] }}
          >
            <StyledText className="text-white font-bold">
              Add to Daily Log
            </StyledText>
          </Button>
        </StyledLayout>
        )}
        {actionDetail?.category === "QC Initiatives" && <QCPlug />}
      </StyledLayout>
    </StyledLayout>
  );

  const QCPlug = () => {
    return (
    <>
      <StyledText className="text-start w-80 text-sm p-2 text-gray-600">Visit their page for schedules and details ✨</StyledText>
      <Link href={"https://web.facebook.com/qc.climatechangedepartment"} className="rounded-2xl p-3 mb-3" style={{backgroundColor: myTheme["color-info-500"]}}>
        <StyledLayout className="px-1 bg-transparent justify-end">
        <MaterialCommunityIcons name="facebook" size={20} color={"white"}/> 
        </StyledLayout>
        <StyledText className="text-[17px] leading-6 text-white border underline font-bold">
          Quezon City Climate Change and Environmental Sustainability Department
        </StyledText>
      </Link>
      </>
    );
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <StyledLayout className="ml-2">
      <StyledText
        className="flex-row items-center"
        style={{
          color: myTheme["color-success-700"],
          fontFamily: "Poppins-Bold",
          fontSize: 20,
        }}
      >
        {title}
      </StyledText>
    </StyledLayout>
  );

  return (
    <StyledLayout className="flex-1">
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={2000}
        style={{ height: "auto", zIndex: 10 }}
      >
        ✅ Added to your Daily Log
      </Snackbar>
      <FlatList
        className="max-h-screen p-3"
        // style={{maxHeight: vh(97)}}
        data={[
          { type: "Facts", data: facts, emoji: "🌏" },
          { type: "Benefits", data: benefits, emoji: "💡" },
          { type: "Instructions", data: instructions, emoji: "📝" },
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
                className={`flex-row items-start p-3 m-2 rounded-md shadow-lg ${borderColor}`}
                style={{ backgroundColor: myTheme["color-success-100"] }}
              >
                <StyledText category="h5" className="" style={{ zIndex: 40 }}>
                  {item.emoji}
                </StyledText>
                <StyledLayout
                  className="m-1 flex-shrink"
                  style={{ backgroundColor: myTheme["color-success-100"] }}
                >
                  {contentItem.benefitTitle && (
                    <StyledLayout
                      className="rounded-lg p-1 mb-1 align-center"
                      style={{ backgroundColor: myTheme["color-success-200"] }}
                    >
                      <StyledText
                        className="text-white"
                        style={{
                          fontFamily: "Poppins-Bold",
                          fontSize: 16,
                          color: myTheme["color-success-800"],
                        }}
                      >
                        {contentItem.benefitTitle}
                      </StyledText>
                    </StyledLayout>
                  )}
                  <StyledText
                    className=""
                    style={{ fontFamily: "Poppins-Medium" }}
                  >
                    {contentItem.content}
                  </StyledText>
                </StyledLayout>
              </StyledLayout>
            ))}

            {(actionDetail!.title.includes("Choose a meal") ||
              actionDetail!.title.includes("Replace a vegetarian meal")) &&
            item.type === "Instructions" ? (
              <StyledLayout className="h-max mb-10">
                <StyledText
                  className="p-3 mx-2 my-1"
                  style={{
                    color: myTheme["color-success-700"],
                    fontFamily: "Poppins-Bold",
                    fontSize: 20,
                  }}
                >
                  Your next meal idea is on us—get inspired and enjoy!
                </StyledText>
                {Object.entries(recipes)
                  .filter(([key, recipe]) => {
                    const articleWords = actionDetail!.title
                      .toLowerCase()
                      .split(/[\s-]+/);

                    // Ensure the key is a valid category
                    const matchedCategory = Object.keys(recipes).find(
                      (category) =>
                        articleWords.some((word) =>
                          category.toLowerCase().includes(word)
                        )
                    ) as RecipeCategory | undefined;

                    if (!matchedCategory) return false; // No match found

                    // Compare carbon emissions
                    const matchedCategoryEmissions =
                      carbonEmissionsRank[matchedCategory];
                    return (
                      carbonEmissionsRank[key as RecipeCategory] <
                      matchedCategoryEmissions
                    );
                  })
                  .map(([key, recipe]) => (
                    <TouchableOpacity
                      className="rounded-lg p-2 mx-2 my-1"
                      onPress={() => openLink(recipe.link)}
                      style={{ backgroundColor: myTheme["color-success-800"] }}
                    >
                      <StyledText
                        className=""
                        key={key}
                        style={{
                          color: myTheme["color-success-100"],
                          fontFamily: "Poppins-Regular",
                          fontSize: 16,
                        }}
                      >
                        {recipe.title}
                        {"  "}
                        {recipe.icon}
                      </StyledText>
                    </TouchableOpacity>
                  ))}
              </StyledLayout>
            ) : (
              <></>
            )}
          </StyledLayout>
        )}
      />
    </StyledLayout>
  );
};

export default EcoActionDetail;
