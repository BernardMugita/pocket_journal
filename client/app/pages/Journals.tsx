import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { styled } from "nativewind";
import {
  useNavigation,
  useRoute,
  RouteProp,
  NavigationProp,
} from "@react-navigation/native";
import FormField from "@/components/form_field";
import JournalItem from "../../components/journal_item";
import FloatingButton from "../../components/floating_button";
import { BASEURL, useAuth } from "../context/AuthContext";
import axios from "axios";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { images } from "@/constants";

type RootStackParamList = {
  single_journal: undefined;
  edit_journal: undefined;
  WriteJournal: { categoryName: string };
  Journals: { categoryName: string };
  pages: {
    screen: string;
    params: { journalId: string };
  };
};

type JournalsRouteProp = RouteProp<RootStackParamList, "Journals">;
type JournalScreenProps = NativeStackScreenProps<RootStackParamList, "pages">;

const JournalsBackground = styled(ImageBackground);
const IntroBanner = styled(ImageBackground);

type Props = {};

interface Journals {
  journalId: string;
  title: string;
  owner: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

const Journals = ({ navigation }: JournalScreenProps) => {
  const today = new Date(Date.now());
  const [search, setSearch] = useState({
    searchQuery: "",
  });

  const [journals, setJournals] = useState<Journals[]>([]);
  const { authState } = useAuth();

  const route = useRoute<JournalsRouteProp>();
  const { categoryName } = route.params as { categoryName: string };
  const [noJournalsFound, setNoJournalsFound] = useState<boolean>(false);
  const timeRightNow = today.getHours();
  const isDayTime = timeRightNow >= 6 && timeRightNow < 18;

  const getCategoryJournals = async () => {
    const token = authState?.token;
    const baseUrl = BASEURL;

    try {
      const getCategoryJournalsRequest = await axios.post(
        categoryName
          ? `${baseUrl}/journals/get_journals_by_category`
          : `${baseUrl}/journals/get_user_journals`,
        categoryName
          ? {
              categoryName: categoryName,
            }
          : {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (getCategoryJournalsRequest.status === 200) {
        setJournals(getCategoryJournalsRequest.data.journals);
      }
      if (getCategoryJournalsRequest.status === 404) {
        setNoJournalsFound(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategoryJournals();
  }, []);

  return (
    <ScrollView
      className="bg-[#ffe3d8]"
      contentContainerStyle={{ height: "100%" }}
    >
      <JournalsBackground
        className="flex-1 items-center justify-start opacity-250 relative"
        source={images.bg}
        resizeMode="contain"
        imageStyle={styles.image}
      >
        <View className="h-[300px] w-[100%]">
          <IntroBanner
            className="h-[300px] justify-between p-4"
            source={isDayTime ? images.day : images.night}
            resizeMode="cover"
            imageStyle={styles.bannerOpacity}
          >
            <View className="w-full items-end">
              <FloatingButton
                handleNavigate={() =>
                  navigation.navigate("WriteJournal", {
                    categoryName: categoryName,
                  })
                }
                name="Write"
              />
            </View>
            <View className="items-start flex-col">
              <Text className="font-pblack text-white text-2xl">
                Today is {today.toLocaleDateString().toString()}
              </Text>
              <Text className="font-pregular text-base text-white">
                You have no new journal entries
              </Text>
            </View>
          </IntroBanner>
        </View>
        <View className="px-4">
          <FormField
            title="Search"
            value={search.searchQuery}
            handleChangeText={(e: string) =>
              setSearch({ ...search, searchQuery: e })
            }
            inputStyles="w-full h-16 px-4 border-2 border-red-950 rounded-xl flex-row items-center bg-red-200"
            otherStyles="mt-5 w-full"
            placeholder="Search journals . . ."
            keyboardType=""
          />
        </View>
        <View className="p-4 w-full">
          <Text className="font-pbold text-base text-black mb-4">
            Journal Entries
          </Text>
          <View className="flex-col">
            {journals.length === 0 || noJournalsFound ? (
              <View className="w-full items-center justify-center p-4 bg-[#ff60006b]">
                <Text className="font-pbold text-base text-orange-600">
                  No Entries for this Journal
                </Text>
              </View>
            ) : (
              journals.map((journal) => (
                <JournalItem
                  journal={journal}
                  navigation={navigation}
                  key={journal.journalId}
                />
              ))
            )}
          </View>
        </View>
      </JournalsBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  shadow: {
    elevation: 100,
  },
  image: {
    opacity: 0.25,
  },
  bannerOpacity: {
    opacity: 0.85,
  },
});

export default Journals;
