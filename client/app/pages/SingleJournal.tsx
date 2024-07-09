import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { RouteProp, useRoute } from "@react-navigation/native";
import { BASEURL, useAuth } from "../context/AuthContext";
import axios, { AxiosError } from "axios";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import SuccessWidget from "@/components/success_widget";
import ErrorWidget from "@/components/error_widget";

type Props = {};

type RootStackParamList = {
  SingleJournal: { journalId: string };
  EditJournal: { journal: Journals };
  write_journal: undefined;
  Journals: { categoryName: string };
  pages: {
    screen: string;
    params: { journal: Journals };
  };
};

interface Journals {
  journalId: string;
  title: string;
  owner: string;
  content: string;
  category: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

type JournalsRouteProp = RouteProp<RootStackParamList, "SingleJournal">;
type JournalScreenProps = NativeStackScreenProps<RootStackParamList, "pages">;

const SingleJournal = ({ navigation }: JournalScreenProps) => {
  const route = useRoute<JournalsRouteProp>();
  const { journalId } = route.params as { journalId: string };
  const { authState } = useAuth();
  const [journal, setJournal] = useState<Journals>();
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getJournal = async () => {
    const token = authState?.token;
    const baseUrl = BASEURL;

    try {
      const getJournalRequest = await axios.post(
        `${baseUrl}/journals/get_journal`,
        {
          journalId: journalId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (getJournalRequest.status === 200) {
        setJournal(getJournalRequest.data.journal);
        console.log(getJournalRequest.data.journal);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteJournal = async () => {
    const token = authState?.token;
    const baseUrl = BASEURL;

    try {
      const deleteJournalRequest = await axios.post(
        `${baseUrl}/journals/delete_journal`,
        {
          journalId: journalId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (deleteJournalRequest.status === 200) {
        console.log(deleteJournalRequest.data);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          navigation.goBack();
        }, 3000);
      }
    } catch (error) {
      console.error(error as AxiosError);
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };

  const formatDate = (date: string) => {
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return formattedDate;
  };

  useEffect(() => {
    getJournal();
  }, []);

  const handleNavigate = () => {
    navigation.navigate("pages", {
      screen: "EditJournal",
      params: { journal: journal as Journals },
    });
  };

  return (
    <ScrollView
      className="bg-[#ffe3d8] p-4"
      scrollEnabled={true}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      {success ? <SuccessWidget message="Journal Deleted Successfully" /> : null}
      {error ? <ErrorWidget message="Something went wrong!" /> : null}
      <View className="flex-row gap-2 justify-end mb-4">
        <TouchableOpacity
          className="bg-[#0088006b] p-3 rounded-xl flex-row items-center"
          onPress={handleNavigate}
        >
          <Text className="text-base font-pregular text-[#008000] mr-2">
            Edit
          </Text>
          <Ionicons name="pencil-outline" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={deleteJournal}
          className="bg-[#ff00006b] p-3 rounded-xl flex-row items-center"
        >
          <Text className="text-base font-pregular text-[#ff0000] mr-2">
            Delete
          </Text>
          <Ionicons name="trash-bin-outline" />
        </TouchableOpacity>
      </View>
      <View className="w-full h-[300px] rounded-xl mb-4">
        <Image
          className="h-full w-full rounded-xl"
          source={images.placeholder}
        ></Image>
      </View>
      <View className="flex-row gap-3">
        <Text className="text-base font-pbold text-red-950">Journal Name</Text>
        <Text className="text-base font-pregular text-red-950">
          {journal?.title}
        </Text>
      </View>
      <View className="flex-row gap-3">
        <Text className="text-base font-pbold text-red-950">Author</Text>
        <Text className="text-base font-pregular text-red-950">
          {journal?.owner}
        </Text>
      </View>
      <View className="flex-row gap-3 mb-4">
        <Text className="text-base font-pbold text-red-950">Category</Text>
        <Text className="text-base font-pregular text-red-950">
          {journal?.category}
        </Text>
      </View>
      <View className="flex-column gap-3 mb-4">
        <Text className="text-base font-pbold text-red-950">Entry</Text>
        <Text className="text-base font-pregular text-red-950 bg-white p-4 rounded-xl">
          {journal?.content}
        </Text>
      </View>
      <View className="flex-column border-t-2 py-4">
        <Text className="text-base font-pbold text-red-950">Meta</Text>
        <View className="flex-row justify-between">
          <Text className="text-base font-pbold text-red-950">
            Date published
          </Text>
          <Text className="text-base font-pregular text-red-950">
            {formatDate((journal as Journals)?.createdAt)}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-base font-pbold text-red-950">
            Date updated
          </Text>
          <Text className="text-base font-pregular text-red-950">
            {formatDate((journal as Journals)?.updatedAt)}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-base font-pbold text-red-950">Word count</Text>
          <Text className="text-base font-pregular text-red-950">
            {journal?.content.length} Words
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default SingleJournal;
