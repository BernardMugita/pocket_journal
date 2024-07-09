import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

type Props = {};

const SingleJournal = (props: Props) => {
  return (
    <ScrollView
      className="bg-[#ffe3d8] p-4"
      scrollEnabled={true}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <View className="flex-row gap-2 justify-end mb-4">
        <TouchableOpacity className="bg-[#0088006b] p-3 rounded-xl flex-row items-center">
          <Link
            href={"edit_journal"}
            className="text-base font-pregular text-[#008000] mr-2"
          >
            Edit
          </Link>
          <Ionicons name="pencil-outline" />
        </TouchableOpacity>
        <TouchableOpacity className="bg-[#ff00006b] p-3 rounded-xl flex-row items-center">
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
          Name of Journal
        </Text>
      </View>
      <View className="flex-row gap-3">
        <Text className="text-base font-pbold text-red-950">Author</Text>
        <Text className="text-base font-pregular text-red-950">
          Name of author
        </Text>
      </View>
      <View className="flex-row gap-3 mb-4">
        <Text className="text-base font-pbold text-red-950">Category</Text>
        <Text className="text-base font-pregular text-red-950">category</Text>
      </View>
      <View className="flex-column gap-3 mb-4">
        <Text className="text-base font-pbold text-red-950">Entry</Text>
        <Text className="text-base font-pregular text-red-950 bg-white p-4 rounded-xl">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum
          ratione voluptatem distinctio temporibus amet? Corporis et
          voluptatibus ratione, eos officiis beatae numquam voluptatum nihil
          earum repellendus. Asperiores non atque voluptas. Lorem ipsum dolor
          sit amet, consectetur adipisicing elit. Non architecto animi deleniti
          recusandae dolorum sapiente saepe esse reiciendis illo labore,
          voluptatem consectetur quasi, et nihil maiores molestias deserunt,
          alias magni.
        </Text>
      </View>
      <View className="flex-column border-t-2 py-4">
        <Text className="text-base font-pbold text-red-950">Meta</Text>
        <View className="flex-row justify-between">
          <Text className="text-base font-pbold text-red-950">
            Date published
          </Text>
          <Text className="text-base font-pregular text-red-950">
            11-05-2024
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-base font-pbold text-red-950">
            Date updated
          </Text>
          <Text className="text-base font-pregular text-red-950">
            11-05-2024
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-base font-pbold text-red-950">Word count</Text>
          <Text className="text-base font-pregular text-red-950">
            450 words
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default SingleJournal;
