import React from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { images } from "@/constants";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";
import { BASEURL, useAuth } from "@/app/context/AuthContext";

interface Category {
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

type Props = {
  category: Category;
  navigation: NativeStackNavigationProp<RootStackParamList, "pages">;
  error: boolean;
  success: boolean;
  categoryMode: boolean;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setCatMode: React.Dispatch<React.SetStateAction<boolean>>;
  onEditCategory: (category: Category) => void;
};

const RecentJournalHeader = styled(ImageBackground);

const CategoryItem = ({
  category,
  navigation,
  onEditCategory,
  setSuccess,
}: Props) => {
  const { authState } = useAuth();
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

  const deleteCategory = async () => {
    const token = authState?.token;
    const baseUrl = BASEURL;
    
    try {
      console.log("deleting...")
      const deleteCategoryRequest = await axios.post(
        `${baseUrl}/categories/delete_category`,
        {
          categoryId: category.categoryId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (deleteCategoryRequest.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Warning",
      `Are you sure you want to delete ${category.categoryName} category?`,
      [
        {
          text: "Cancel",
          onPress: () => {},
        },
        {
          text: "Delete",
          onPress: () => {
            deleteCategory();
          },
        },
      ]
    );
  };

  return (
    <View className="bg-white w-full rounded-xl mb-2 mr-2">
      <View className="h-[100px]">
        <RecentJournalHeader
          source={images.placeholder}
          className="w-full h-full items-end"
        >
          <View className="flex-row m-2">
            <TouchableOpacity
              className="bg-[#0088006b] p-2 mr-1"
              onPress={() => onEditCategory(category)}
            >
              <Ionicons name="pencil-outline" />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-[#ff00006b] p-2"
              onPress={confirmDelete}
            >
              <Ionicons name="trash-bin-outline" />
            </TouchableOpacity>
          </View>
        </RecentJournalHeader>
      </View>
      <TouchableOpacity onPress={handlePress} className="p-4">
        <View className="flex-row justify-between items-center">
          <Text className="font-pbold flex-1">Category name</Text>
          <Text className="font-pregular">{category.categoryName}</Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="font-pbold flex-1">Created At</Text>
          <Text className="font-pregular">{formattedDate}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CategoryItem;
