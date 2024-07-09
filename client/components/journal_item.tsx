import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { images } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { Link, useNavigation } from "expo-router";
import { NavigationProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type Props = {
  // onPress: () => void;
  journal: Journals;
  navigation: NativeStackNavigationProp<RootStackParamList, "pages">;
};

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

interface Journals {
  journalId: string;
  title: string;
  owner: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

const JournalItem: React.FC<Props> = ({ journal, navigation }) => {
  const formattedDate = new Date(journal.createdAt).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      // month: "long",
      // day: "numeric",
    }
  );

  const time = new Date(journal.createdAt).toLocaleDateString("en-Us", {
    hour: "2-digit",
    minute: "2-digit",
    dayPeriod: "short",
  });

  const handlePress = () => {
    navigation.navigate("pages", {
      screen: "SingleJournal",
      params: { journalId: journal.journalId },
    });
  };

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
        <TouchableOpacity
          onPress={handlePress}
          className="font-psemibold text-base"
        >
          <Text className="text-base font-pbold">{journal.title}</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-col items-end">
        <Text className="font-pregular">{formattedDate}</Text>
        <Text className="font-pregular">{time}</Text>
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
