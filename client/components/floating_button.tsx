import { View, Text } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Link } from "expo-router";

type Props = {
  route: string;
  name: string
};

const FloatingButton: React.FC<Props> = ({ route, name }) => {
  return (
    <View className="absolute items-center flex-col bottom-2 right-2">
      <Link href={`${route}`} className="bg-[#450a0a] rounded-full">
        <Ionicons
          name="pencil-outline"
          size={60}
          color="#fff"
          className=""
        />
      </Link>
      <Text className="font-pbold text-white text-base">{name}</Text>
    </View>
  );
};

export default FloatingButton;
