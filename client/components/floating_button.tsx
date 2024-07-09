import { View, Text } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

type Props = {
  handleNavigate: () => void;
  name: string;
};

const FloatingButton: React.FC<Props> = ({ handleNavigate, name }) => {
  return (
    <TouchableOpacity
      onPress={handleNavigate}
      className="absolute items-center flex-col top-[-520] right-[-190]"
    >
      <View className="bg-[#450a0a] rounded-full">
        <Ionicons name="pencil-outline" size={60} color="#fff" className="" />
      </View>
      <Text className="font-pbold text-white text-base">{name}</Text>
    </TouchableOpacity>
  );
};

export default FloatingButton;
