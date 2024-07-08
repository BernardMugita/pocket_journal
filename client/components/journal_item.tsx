import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { images } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { Link, useNavigation } from "expo-router";
import { NavigationProp } from "@react-navigation/native";

type Props = {
  onPress: () => void;
};

const JournalItem: React.FC<Props> = ({ onPress }) => {
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
        <Link href="single_journal" className="font-psemibold text-base">
          Journal name
        </Link>
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
