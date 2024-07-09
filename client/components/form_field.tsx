import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import React from "react";
import { useState } from "react";
import { icons } from ".././constants";
import RNPickerSelect from "react-native-picker-select";

type Props = {
  title: string;
  value: string;
  placeholder: string;
  handleChangeText: (e: string) => void;
  otherStyles: string;
  keyboardType: string;
  inputStyles: string;
};

const FormField: React.FC<Props> = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  keyboardType,
  inputStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [category, setCategory] = useState("");
  return (
    <View className={`${otherStyles}`}>
      <Text className="font-psemibold text-xl mb-2">{title}</Text>

      <View className={`${inputStyles}`}>
        {title === "Category" ? (
          <RNPickerSelect
            onValueChange={(value) => setCategory(value)}
            value={category}
            items={[
              { label: "Option 1", value: "option1" },
              { label: "Option 2", value: "option2" },
              { label: "Option 3", value: "option3" },
            ]}
            placeholder={{ label: `${placeholder}`, value: null }}
            style={pickerSelectStyles}
          />
        ) : (
          <TextInput
            className="flex-1 text-white font-psemibold w-full"
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#ff6000"
            onChangeText={handleChangeText}
            secureTextEntry={title === "Password" && !showPassword}
            multiline={title === "Content"}
            numberOfLines={15}
          />
        )}

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6 "
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}

        {title === "Search" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={icons.search}
              className="w-6 h-6 "
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default FormField;
