import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { images } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import FormField from "@/components/form_field";
import RNPickerSelect from "react-native-picker-select";
import CustomButton from "@/components/custom_button";

type Props = {};

const EditJournal = (props: Props) => {
  const [writeJournal, setWriteJournal] = useState({
    title: "",
    owner: "",
    content: "",
    category: "",
  });

  return (
    <ScrollView
      className="bg-[#ffe3d8] p-4"
      scrollEnabled={true}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
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
        <FormField
          title="Category"
          value={writeJournal.category}
          handleChangeText={(e: string) =>
            setWriteJournal({ ...writeJournal, category: e })
          }
          inputStyles="w-full h-16 px-4 border-2 border-gray-300 rounded-xl flex-row items-center bg-transparent"
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
            handlePress={() => {}}
            containerStyles="bg-[#008800] ml-2 rounded-xl justify-center items-center p-4 flex-1 text-center"
            textStyles="font-pregular text-white text-base"
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default EditJournal;
