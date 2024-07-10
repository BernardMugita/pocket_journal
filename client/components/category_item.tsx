import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { images } from "@/constants";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type Props = {
  category: {
    categoryName: string;
    owner: string;
    createdAt: string;
    updateAt: string;
  };
  navigation: NativeStackNavigationProp<RootStackParamList, "pages">;
};

type RootStackParamList = {
  single_journal: undefined;
  edit_journal: undefined;
  write_journal: undefined;
  pages: {
    screen: string;
    params: { categoryName: string };
  };
};

const CategoryItem = ({ category, navigation }: Props) => {
  const formattedDate = new Date(category.createdAt).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const handlePress = () => {
    navigation.navigate("pages", {
      screen: "Journals",
      params: { categoryName: category.categoryName },
    });
  };

  return (
    <View className="bg-white w-full rounded-xl mb-2 mr-2">
      <View className="h-[100px]">
        <Image
          className="w-full h-full rounded-tr-xl rounded-tl-xl"
          source={images.placeholder}
        />
      </View>
      <TouchableOpacity onPress={handlePress} className="p-4">
        <View className="flex-row justify-between items-center">
          <Text className="font-pbold flex-1">Category name</Text>
          <Text className="font-pregular">{category.categoryName}</Text>
        </View>
        {/* <View className="flex-row justify-between items-center">
          <Text className="font-pbold flex-1">No of entries</Text>
          <Text className="font-pregular">5</Text>
        </View> */}
        <View className="flex-row justify-between items-center">
          <Text className="font-pbold flex-1">Created At</Text>
          <Text className="font-pregular">{formattedDate}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CategoryItem;
