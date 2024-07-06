import { View, Text } from "react-native";
import React from "react";

type Props = {
  message: string;
};

const SuccessWidget: React.FC<Props> = ({ message }) => {
  return (
    <View className="absolute top-10 left-0 right-0 p-4 bg-green-500 bg-opacity-5 mx-auto w-100%">
      <Text className="text-white font-pbold text-center">{message}</Text>
    </View>
  );
};

export default SuccessWidget;
