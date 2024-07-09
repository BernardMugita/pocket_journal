import { View, Text } from "react-native";
import React, { useState } from "react";
import FormField from "./form_field";
import CustomButton from "./custom_button";

type Props = {};

const CreateCategoryPopup = (props: Props) => {
  const [createCategory, setCreateCategory] = useState({
    categoryName: "",
  });

  return (
    <View className="w-full h-full bg-[#0000006b] absolute top-0 left-0 items-center justify-center">
      <View className="bg-white p-4 w-[300px] rounded-xl">
        <FormField
          title="Category name"
          value={createCategory.categoryName}
          handleChangeText={(e: string) =>
            setCreateCategory({ ...createCategory, categoryName: e })
          }
          inputStyles="w-full h-16 px-4 border-b-2 border-gray-300 rounded-xl flex-row items-center bg-transparent"
          otherStyles="mt-5 w-full"
          placeholder="Category name . . ."
          keyboardType=""
        />
        <View className="my-4 flex-row">
          <CustomButton
            title="Cancel"
            handlePress={() => {}}
            containerStyles="bg-[#fff] rounded-xl justify-center items-center p-4 flex-1 text-center"
            textStyles="font-pregular text-red-950 text-base"
          />
          <CustomButton
            title="Save changes"
            handlePress={() => {}}
            containerStyles="bg-[#008800] ml-2 rounded-xl justify-center items-center p-4 flex-1 text-center"
            textStyles="font-pregular text-white text-base"
          />
        </View>
      </View>
    </View>
  );
};

export default CreateCategoryPopup;
