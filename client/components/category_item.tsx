import { View, Text, Image } from "react-native";
import React from "react";
import { images } from "@/constants";

type Props = {};

const CategoryItem = (props: Props) => {
  return (
    <View className="bg-white w-[47%] rounded-xl mb-2 mr-2">
        <View className="h-[100px]">
        <Image className=" w-full h-full rounded-tr-xl rounded-tl-xl" source={images.placeholder}/>
        </View>
      <View className="p-4">
        <View className="flex-row justify-between">
          <Text className="font-pbold">Journal name</Text>
          {/* <Text className='font-pregular'>Journal name</Text> */}
        </View>
        <View className="flex-row justify-between">
          <Text className="font-pbold">No of entries</Text>
          <Text className="font-pregular">5</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="font-pbold">Created At</Text>
          <Text className="font-pregular">Jan, 2024</Text>
        </View>
      </View>
    </View>
  );
};

export default CategoryItem;
