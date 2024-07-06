import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useState } from "react";
import { icons } from ".././constants";

type Props = {
  title: string;
  value: string;
  placeholder: string;
  handleChangeText: (e: string) => void;
  otherStyles: string;
  keyboardType: string;
};

const FormField: React.FC<Props> = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  keyboardType,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className={`${otherStyles} w-full`}>
      <Text className="font-psemibold text-xl">{title}</Text>

      <View className="w-full h-16 px-4 bg-gray-200 rounded-xl flex-row items-center">
        <TextInput
          className="flex-1 text-white font-psemibold w-full"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#ff6000"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6 "
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
