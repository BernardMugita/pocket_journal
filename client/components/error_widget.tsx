import { View, Text } from "react-native";
import React from "react";

type Props = {
  message: string;
};

const ErrorWidget: React.FC<Props> = ({ message }) => {
  return (
    <View className="absolute top-10 left-0 right-0 p-4 bg-red-500 bg-opacity-5 z-50 mx-auto w-100%">
      <Text className="text-white font-pbold text-center">{message}</Text>
    </View>
  );
};

export default ErrorWidget;
