import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { images } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import FormField from "@/components/form_field";
import RNPickerSelect from "react-native-picker-select";
import CustomButton from "@/components/custom_button";
import { RouteProp, useRoute } from "@react-navigation/native";
import { BASEURL, useAuth } from "../context/AuthContext";
import axios, { AxiosError } from "axios";
import SuccessWidget from "@/components/success_widget";
import ErrorWidget from "@/components/error_widget";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

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

type JournalsRouteProp = RouteProp<RootStackParamList, "EditJournal">;
type JournalScreenProps = NativeStackScreenProps<RootStackParamList, "pages">;

const EditJournal = ({ navigation }: JournalScreenProps) => {
  const route = useRoute<JournalsRouteProp>();
  const { journal } = route.params as { journal: Journals };
  const { authState } = useAuth();
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);


  const [writeJournal, setWriteJournal] = useState({
    title: journal.title,
    owner: journal.owner,
    content: journal.content,
    category: journal.category,
  });

  const editJournal = async () => {
    const token = authState?.token;
    const baseUrl = BASEURL;

    try {
      const editJournalRequest = await axios.post(
        `${baseUrl}/journals/edit_journal`,
        {
          journalId: journal.journalId,
          title: writeJournal.title,
          content: writeJournal.content,
          category: writeJournal.category,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (editJournalRequest.status === 200) {
        console.log(editJournalRequest.data);
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

  return (
    <ScrollView
      className="bg-[#ffe3d8] p-4"
      scrollEnabled={true}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      {success ? <SuccessWidget message="Journal Edited Successfully" /> : null}
      {error ? <ErrorWidget message="Something went wrong!" /> : null}
      {/* <View className="w-full h-[300px] rounded-xl mb-4">
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
      </View> */}
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
          inputStyles="w-full px-4 border-b-2 border-gray-300 rounded-xl flex-row items-center bg-transparent"
          otherStyles="mt-5"
          placeholder="Share your thoughts . . ."
          keyboardType=""
        />
        <FormField
          title="Category"
          value={writeJournal.category}
          handleChangeText={(e: string) =>
            setWriteJournal({ ...writeJournal, category: e })
          }
          inputStyles="w-full h-16 flex-row items-center bg-transparent"
          otherStyles="mt-5"
          placeholder="Select a category"
          keyboardType=""
        />

        <View className="my-4 flex-row">
          <CustomButton
            title="Discard"
            handlePress={() => {}}
            containerStyles="bg-[#fff] rounded-xl justify-center items-center p-4 flex-1 text-center"
            textStyles="font-pregular text-red-950 text-base"
          />
          <CustomButton
            title="Save changes"
            handlePress={() => {
              editJournal();
            }}
            containerStyles="bg-[#008800] ml-2 rounded-xl justify-center items-center p-4 flex-1 text-center"
            textStyles="font-pregular text-white text-base"
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default EditJournal;
