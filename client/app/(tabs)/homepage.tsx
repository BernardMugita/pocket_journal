import { View, Text } from "react-native";
import React from "react";

type Props = {};

const HomePage = (props: Props) => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl font-pblack">Journaling App</Text>
    </View>
  );
};

export default HomePage;
