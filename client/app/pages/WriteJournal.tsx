import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { images } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import FormField from "@/components/form_field";
import RNPickerSelect from "react-native-picker-select";
import CustomButton from "@/components/custom_button";
import { router } from "expo-router";
import { RouteProp, useRoute } from "@react-navigation/native";
import { BASEURL, useAuth } from "../context/AuthContext";
import axios, { AxiosError } from "axios";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import SuccessWidget from "@/components/success_widget";
import ErrorWidget from "@/components/error_widget";

type Props = {};

type RootStackParamList = {
  SingleJournal: { journalId: string };
  EditJournal: undefined;
  WriteJournal: { categoryName: string };
  Journals: { categoryName: string };
  pages: {
    screen: string;
    params: { journalId: string };
  };
};

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

type JournalsRouteProp = RouteProp<RootStackParamList, "Journals">;
type JournalScreenProps = NativeStackScreenProps<RootStackParamList, "pages">;

const WriteJournal = ({ navigation }: JournalScreenProps) => {
  const [writeJournal, setWriteJournal] = useState({
    title: "",
    owner: "",
    content: "",
    category: "",
  });

  const route = useRoute<JournalsRouteProp>();
  const { categoryName } = route.params as { categoryName: string };
  const { authState } = useAuth();
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const [user, setUser] = useState({});
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

  const writeNewJournal = async () => {
    const token = authState?.token;
    const baseUrl = BASEURL;

    try {
      const writeNewJournalRequest = await axios.post(
        `${baseUrl}/journals/create_journal`,
        {
          title: writeJournal.title,
          owner: (user as User)?.username,
          content: writeJournal.content,
          category: categoryName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (writeNewJournalRequest.status === 200) {
        const journal = writeNewJournalRequest.data.journal;
        console.log(journal);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          navigation.navigate("pages", {
            screen: "SingleJournal",
            params: { journalId: journal.journalId },
          });
          // navigation.pop()
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

  useEffect(() => {
    getSignedInUser();
  }, []);

  return (
    <ScrollView
      className="bg-[#ffe3d8] p-4"
      scrollEnabled={true}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      {success ? <SuccessWidget message="Entry made Successfully" /> : null}
      {error ? <ErrorWidget message="Something went wrong!" /> : null}
      <View className="w-full mb-4">
        <Text className="font-pbold text-xl text-red-950">
          New journal entry
        </Text>
      </View>
      <View className="w-full h-[300px] rounded-xl mb-4">
        <Image
          className="h-full w-full rounded-xl"
          source={images.placeholder}
        ></Image>
      </View>
      <View className="w-full items-center justify-center">
        <TouchableOpacity className="bg-[#450a0a] p-3 rounded-xl flex-row items-center w-[150px] justify-center">
          <Text className="text-base font-pregular text-[#fff] mr-2">
            Upload Image
          </Text>
          <Ionicons name="image" />
        </TouchableOpacity>
      </View>
      <View>
        <FormField
          title="Title"
          value={writeJournal.title}
          handleChangeText={(e: string) =>
            setWriteJournal({ ...writeJournal, title: e })
          }
          inputStyles="w-full h-16 px-4 border-b-2 border-gray-300 rounded-xl flex-row items-center bg-transparent"
          otherStyles="mt-5"
          placeholder="Journal title . . ."
          keyboardType=""
        />
        <FormField
          title="Content"
          value={writeJournal.content}
          handleChangeText={(e: string) =>
            setWriteJournal({ ...writeJournal, content: e })
          }
          inputStyles="w-full h-16 px-4 border-b-2 border-gray-300 rounded-xl flex-row items-center bg-transparent"
          otherStyles="mt-5"
          placeholder="Share your thoughts . . ."
          keyboardType=""
        />
        {/* <FormField
          title="Category"
          value={writeJournal.category}
          handleChangeText={(e: string) =>
            setWriteJournal({ ...writeJournal, category: e })
          }
          inputStyles="w-full h-16 px-4 border-2 border-gray-300 rounded-xl flex-row items-center bg-transparent"
          otherStyles="mt-5"
          placeholder="Select a category"
          keyboardType=""
        /> */}
        <View className="my-4">
          <CustomButton
            title="Create"
            handlePress={() => {
              writeNewJournal();
            }}
            containerStyles="bg-red-950 rounded-xl justify-center items-center p-4 flex-1 text-center"
            textStyles="font-pregular text-white text-base"
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default WriteJournal;
