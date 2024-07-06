import {
  View,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import React from "react";

type Props = {
  title: string;
  handlePress: () => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
};

const CustomButton: React.FC<Props> = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`${containerStyles}`}
      disabled={isLoading}
    >
      <Text className={`${textStyles}`}>
        {isLoading ? "Loading..." : title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
