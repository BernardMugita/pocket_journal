import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  StyleSheet,
} from "react-native";
import React from "react";
import FormField from "@/components/form_field";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CategoryItem from "@/components/category_item";
import { styled } from "nativewind";
import { images } from "@/constants";
import FloatingButton from "@/components/floating_button";
import DatePicker from "react-native-date-picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

type Props = {};

const CategoriesBackground = styled(ImageBackground);

const Categories = (props: Props) => {
  const [updatedAt, setUpdatedAt] = useState({
    filter: "",
    category: "",
  });
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  return (
    <SafeAreaView className="bg-[#ffe3d8] flex-1 w-full">
      <ScrollView
        scrollEnabled={true}
        contentContainerStyle={{ paddingBottom: 20, height: "100%" }}
      >
        <CategoriesBackground
          className=" flex-1 p-4"
          source={images.bg}
          imageStyle={styles.image}
        >
          <View className="w-full mb-4">
            <Text className="font-pblack text-2xl">Journals</Text>
            <Text className="font-pregular text-base">
              Here are your Journals, under each you'll find the corresponding
              entries
            </Text>
          </View>
          <View className="w-full">
            <Text className="font-psemibold text-base mb-2">
              Filter Journals
            </Text>
          </View>
          <View className="w-full flex-row mb-4">
            <View className="mb-2">
              <TouchableOpacity
                className="p-3 bg-white flex-row items-center"
                onPress={() => setOpen(true)}
              >
                <Ionicons name="calendar" size={20} />
                <Text className="font-pregular text-base ml-2">
                  Select date
                </Text>
              </TouchableOpacity>
              <DatePicker
                modal
                open={open}
                date={date}
                onConfirm={(date) => {
                  setOpen(false);
                  setDate(date);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
            </View>
            <FormField
              title="Category"
              value={updatedAt.category}
              handleChangeText={(e: string) =>
                setUpdatedAt({ ...updatedAt, category: e })
              }
              inputStyles="w-full h-16 px-4 border-2 border-gray-300 rounded-xl flex-row items-center bg-transparent"
              otherStyles="mt-5"
              placeholder="Select a category"
              keyboardType=""
            />
          </View>
          <View className="w-full flex-row flex-wrap gap-2 mb-4 border-t-2 py-4 justify-center">
            <CategoryItem />
            <CategoryItem />
            <CategoryItem />
            <CategoryItem />
          </View>
          <FloatingButton route="/" name="New Journal" />
        </CategoriesBackground>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  shadow: {
    elevation: 100,
  },
  image: {
    opacity: 0.25,
  },
});

export default Categories;
