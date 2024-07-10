import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { images } from "@/constants";

type Props = {
  journal: Journals;
};

interface Journals {
  journalId: string;
  title: string;
  owner: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

const RecentJournal: React.FC<Props> = ({ journal }) => {
  const formatDate = (date: string) => {
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return formattedDate;
  };

  return (
    <View className="flex-col items-start w-full mb-4">
      <Text className="font-pbold text-base text-left mb-4 text-red-950">
        Most recent entry
      </Text>
      <View
        style={styles.shadow}
        className="
            shadow-black-200
              p-4
              rounded-xl
              shadow-xl
              w-full
              h-52
              bg-white
              justify-end
            "
      >
        <View className="flex-1 mb-4">
          <Image
            resizeMode="cover"
            className="h-full w-full"
            source={images.placeholder}
          ></Image>
        </View>
        <View className="flex-row justify-between">
          <Text className="font-pbold text-base">Journal name: </Text>
          <Text className="font-pregular text-base">
            {(journal as Journals)?.title}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="font-pbold text-base">Writen on: </Text>
          <Text className="font-pregular text-base">
            {formatDate((journal as Journals)?.createdAt)}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="font-pbold text-base">Category: </Text>
          <Text className="font-pregular text-base">
            {(journal as Journals)?.category}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="font-pbold text-base">Word count: </Text>
          <Text className="font-pregular text-base">
            {(journal as Journals)?.content.length} Words
          </Text>
        </View>
      </View>
    </View>
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

export default RecentJournal;
