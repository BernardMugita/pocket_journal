import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { images } from "@/constants";
import { Ionicons } from "@expo/vector-icons";

type Props = {};

const JournalItem = (props: Props) => {
  return (
    <View
      className="flex-row justify-between items-center bg-white px-4 py-2 rounded-xl mb-1"
      style={styles.shadow}
    >
      <View className="flex-row items-center gap-2">
        <View
          className="bg-red-300 h-[50px] w-[50px] rounded-full items-center justify-center"
          style={styles.shadow}
        >
          <Ionicons name="calendar-outline" size={30} color="white" />
        </View>
        <Text className="font-psemibold text-base">Journal name</Text>
      </View>
      <View className="flex-col items-end">
        <Text className="font-pregular">Monday,</Text>
        <Text className="font-pregular">11:50am</Text>
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

export default JournalItem;
