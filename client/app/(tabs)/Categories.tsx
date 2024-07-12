import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import CategoryItem from "@/components/category_item";
import { styled } from "nativewind";
import { icons, images } from "@/constants";
import CreateCategoryPopup from "@/components/create_category_popup";
import { BASEURL, useAuth } from "../context/AuthContext";
import axios from "axios";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import SuccessWidget from "@/components/success_widget";
import ErrorWidget from "@/components/error_widget";
import { SafeAreaView } from "react-native-safe-area-context";

interface CategoryResponse {
  categoryId: string;
  categoryName: string;
  owner: string;
  createdAt: string;
  updateAt: string;
}

type RootStackParamList = {
  pages: {
    screen: string;
    params: { categoryName: string };
  };
};

type CategoryScreenProps = NativeStackScreenProps<RootStackParamList, "pages">;

const CategoriesBackground = styled(ImageBackground);

const Categories = ({ navigation }: CategoryScreenProps) => {
  const { authState } = useAuth();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [noCategoriesFound, setNoCategoriesFound] = useState<boolean>(false);
  const [addCategoryMode, setAddCategoryMode] = useState(false);
  const [editCategory, setEditCategory] = useState<CategoryResponse | null>(null);

  const getCategories = async () => {
    const token = authState?.token;
    const baseUrl = BASEURL;

    try {
      const getCategoriesRequest = await axios.post(
        `${baseUrl}/categories/get_user_categories`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (getCategoriesRequest.status === 200) {
        setCategories(getCategoriesRequest.data.categories);
      }
      if (getCategoriesRequest.status === 404) {
        setNoCategoriesFound(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, [categories]);

  const handleEditCategory = (category: CategoryResponse) => {
    setEditCategory(category);
    setAddCategoryMode(true);
  };

  return (
    <SafeAreaView className="bg-[#ffe3d8] flex-1">
      <ScrollView
        scrollEnabled={true}
        contentContainerStyle={
          categories.length > 3
            ? { paddingBottom: 20 }
            : addCategoryMode
            ? { height: "100%" }
            : { height: "100%" }
        }
      >
        {success ? <SuccessWidget message="Success" /> : null}
        {error ? <ErrorWidget message="Something went wrong!" /> : null}
        <CategoriesBackground
          className="flex-1 justify-start h-full"
          source={images.bg}
          imageStyle={styles.image}
        >
          <View className="w-full mb-4 p-4">
            <Text className="font-pblack text-2xl">Categories</Text>
            <Text className="font-pregular text-base">
              Here are your Categories, under each you'll find the corresponding entries
            </Text>
          </View>
          <View className="w-full px-6 items-end">
            <TouchableOpacity
              onPress={() => setAddCategoryMode(true)}
              className="p-2 bg-red-950 rounded-xl flex-row items-center gap-2"
            >
              <Image source={icons.bookmark} className="w-[16px] h-[16px]" />
              <Text className="text-base font-pregular text-white">New Category</Text>
            </TouchableOpacity>
          </View>
          <View className="w-full flex-row flex-wrap p-4 mb-4 py-4 justify-center">
            {categories.length < 1 || noCategoriesFound ? (
              <View className="w-full items-center justify-center p-4 bg-[#ff60006b] mt-10">
                <Text className="font-pbold text-base text-orange-600 text-center">
                  No Journal found, Create a new Journal to get started
                </Text>
              </View>
            ) : (
              categories.map((category, key) => (
                <CategoryItem
                  key={key}
                  navigation={navigation}
                  category={category}
                  success={success}
                  setSuccess={setSuccess}
                  error={error}
                  setError={setError}
                  categoryMode={addCategoryMode}
                  setCatMode={setAddCategoryMode}
                  onEditCategory={handleEditCategory}
                />
              ))
            )}
          </View>
          {addCategoryMode && (
            <CreateCategoryPopup
              onClose={() => {
                setAddCategoryMode(false);
                setEditCategory(null);
              }}
              category={editCategory}
            />
          )}
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
