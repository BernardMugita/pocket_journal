import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import CustomButton from "@/components/custom_button";
import { router, useNavigation } from "expo-router";
import { styled } from "nativewind";
import { BASEURL, useAuth } from "../context/AuthContext";
import axios from "axios";
import RecentJournal from "@/components/recent_journal";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = {};

interface User {
  userId: string;
  role: string;
  profile: string;
  fullname: string;
  username: string;
  password: string;
  salt: string;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  total_user_journals: number;
  most_popular_day: string;
  journal_count: number;
  most_popular_month: string;
  most_popular_category: string;
  unique_categories: number;
  last_month_journals: number;
  last_week_journals: number;
  yesterday_journals: number;
}

interface Journals {
  journalId: string;
  title: string;
  owner: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

type RootStackParamList = {
  WriteJournal: undefined;
  Journals: undefined;
  pages: {
    screen: string;
    params: {};
  };
};

const HomeBackground = styled(ImageBackground);
type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "pages">;

const Homepage = ({ navigation }: HomeScreenProps) => {
  const [user, setUser] = useState<User>();
  const [stats, setStats] = useState<Stats>();
  const { authState } = useAuth();

  const getSignedInUser = async () => {
    const token = authState?.token;
    const baseUrl = BASEURL;

    try {
      const getSignedInUserRequest = await axios.post(
        `${baseUrl}/users/get_user`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (getSignedInUserRequest.status === 200) {
        setUser(getSignedInUserRequest.data.user as User);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getUserJournalsSummary = async () => {
    const token = authState?.token;
    const baseUrl = BASEURL;

    try {
      const getUserJournalStatsRequest = await axios.post(
        `${baseUrl}/summary/journal_summary`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (getUserJournalStatsRequest.status === 200) {
        setStats(getUserJournalStatsRequest.data.stats as Stats);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [journals, setJournals] = useState<Journals>();
  const [noJournalsFound, setNoJournalsFound] = useState<boolean>(false);

  const getUserJournals = async () => {
    const token = authState?.token;
    const baseUrl = BASEURL;

    try {
      const getUserJournalsRequest = await axios.post(
        `${baseUrl}/journals/get_user_journals`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (getUserJournalsRequest.status === 200) {
        const journals = getUserJournalsRequest.data.journals;
        if (journals.length > 0) {
          const sortedJournals = journals.sort(
            (a: { createdAt: string }, b: { createdAt: string }) => {
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            }
          );
          setJournals(sortedJournals[0]);
        } else {
          setNoJournalsFound(true);
        }
      } else if (getUserJournalsRequest.status === 404) {
        setNoJournalsFound(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSignedInUser();
    getUserJournalsSummary();
    getUserJournals();
  }, []);

  return (
    <ScrollView
      className="bg-[#ffe3d8]"
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <HomeBackground
        className="flex-1 items-center justify-start m-2 h-full"
        source={images.bg}
        resizeMode="contain"
        imageStyle={styles.image}
      >
        <View className="flex-row items-center h-[4rem] p-2 border-b-red-200 border-b-2 mb-4">
          <Image
            className="w-[80px] h-[80px]"
            resizeMode="cover"
            source={images.logo}
          ></Image>
          <View className="flex-1 items-start flex-col">
            <Text className="text-3xl font-pblack">Welcome back!</Text>
            <Text className="text-2xl font-pregular">
              {(user as User)?.fullname}
            </Text>
          </View>
        </View>
        <View className="flex-row gap-2 mb-4">
          <View
            className="h-[2rem] flex-1 bg-white rounded-xl p-4"
            style={styles.shadow}
          >
            <Text className="font-pbold text-red-950 text-base">
              Journal entries:
            </Text>
            <Text className="text-base font-pregular">
              {stats?.total_user_journals ? stats?.total_user_journals : "0"}
            </Text>
          </View>
          <View
            className="h-[2rem] flex-1 bg-white rounded-xl p-4"
            style={styles.shadow}
          >
            <Text className="font-pbold text-red-950 text-base">
              Categories:
            </Text>
            <Text className="text-base font-pregular">
              {stats?.unique_categories ? stats?.unique_categories : "0"}
            </Text>
          </View>
        </View>
        <View className="flex-col items-start w-full">
          <Text className="font-pbold text-base text-left text-red-950 mb-4">
            Quick actions
          </Text>
          <View className="flex-row justify-between mb-4 w-full mx">
            <CustomButton
              title="Write"
              handlePress={() =>
                navigation.navigate("pages", {
                  screen: "WriteJournal",
                  params: {},
                })
              }
              containerStyles="bg-red-950 rounded-xl justify-center items-center p-4 flex-1 text-center"
              textStyles="font-pregular text-white text-base"
            />
            <View className="p-1"></View>
            <CustomButton
              title="Journals"
              handlePress={() =>
                navigation.navigate("pages", {
                  screen: "Journals",
                  params: {},
                })
              }
              containerStyles="bg-red-950 rounded-xl justify-center items-center p-4 flex-1 text-center"
              textStyles="font-pregular text-white text-base"
            />
          </View>
        </View>
        <View className="w-full mb-4">
          <Text className="text-base font-pbold mb-4">Journal Stats</Text>
          <View className="bg-white rounded-xl w-full p-2">
            <View className="border-2 border-gray-400 rounded-xl w-full p-2 mb-1">
              <Text className="text-xs font-pregular">Most popular day</Text>
              <Text className="text-base font-psemibold">
                {stats?.most_popular_day
                  ? stats.most_popular_day
                  : "-----------"}
              </Text>
            </View>
            <View className="flex-row gap-1 items-center mb-1">
              <View className="border-2 border-gray-400 rounded-xl flex-1 p-2 py-5">
                <Text className="text-xs font-pregular">Popular month:</Text>
                <Text className="text-base font-psemibold">
                  {stats?.most_popular_month
                    ? stats?.most_popular_month
                    : "---"}
                </Text>
              </View>
              <View className="border-2 border-gray-400 rounded-xl flex-1 p-2 py-5">
                <Text className="text-xs font-pregular">Popular Category:</Text>
                <Text className="text-base font-psemibold">
                  {stats?.most_popular_category
                    ? stats?.most_popular_category
                    : "---"}
                </Text>
              </View>
              <View className="border-2 border-gray-400 rounded-xl flex-1 p-2 py-5">
                <Text className="text-xs font-pregular">Total Journals:</Text>
                <Text className="text-base font-psemibold">
                  {stats?.journal_count ? stats?.journal_count : "0"}
                </Text>
              </View>
            </View>
            <View className="flex-row gap-1 items-center">
              <View className="border-2 border-gray-400 rounded-xl flex-1 p-2 py-5">
                <Text className="text-xs font-pregular">
                  Last month Journals:
                </Text>
                <Text className="text-base font-psemibold">
                  {stats?.last_month_journals
                    ? stats?.last_month_journals
                    : "0"}
                </Text>
              </View>
              <View className="border-2 border-gray-400 rounded-xl flex-1 p-2 py-5">
                <Text className="text-xs font-pregular">
                  Last week Journals:
                </Text>
                <Text className="text-base font-psemibold">
                  {stats?.last_week_journals ? stats?.last_week_journals : "0"}
                </Text>
              </View>
              <View className="border-2 border-gray-400 rounded-xl flex-1 p-2 py-5">
                <Text className="text-xs font-pregular">
                  Yesterday Journals:
                </Text>
                <Text className="text-base font-psemibold">
                  {stats?.yesterday_journals ? stats?.yesterday_journals : "0"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {!journals ? (
          <View className="w-full items-center justify-center p-4 bg-[#ff60006b] mt-10 h-[150px]">
            <Text className="font-pbold text-base text-orange-600 text-center">
              No Journal found, Create a new Journal to list it here
            </Text>
          </View>
        ) : (
          <RecentJournal journal={journals as Journals} />
        )}
      </HomeBackground>
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
});

export default Homepage;
