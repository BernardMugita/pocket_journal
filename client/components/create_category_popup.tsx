import React, { useEffect, useState } from "react";
import { View } from "react-native";
import FormField from "./form_field";
import CustomButton from "./custom_button";
import axios, { AxiosError } from "axios";
import SuccessWidget from "./success_widget";
import ErrorWidget from "./error_widget";
import { BASEURL, useAuth } from "@/app/context/AuthContext";

type Props = {
  onClose: () => void;
  category?: Category | null;
};

interface User {
  userId: string;
  role: string;
  profile: string;
  fullname: string;
  username: string;
  password: string;
  salt: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  categoryId: string;
  categoryName: string;
  owner: string;
  createdAt: string;
  updateAt: string;
}

const CreateCategoryPopup: React.FC<Props> = ({ onClose, category }) => {
  const [categoryName, setCategoryName] = useState(category?.categoryName || "");
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const { authState } = useAuth();
  const [user, setUser] = useState<User | null>(null);

  const getSignedInUser = async () => {
    const token = authState?.token;
    const baseUrl = BASEURL;

    try {
      const getSignedInUserRequest = await axios.post(
        `${baseUrl}/users/get_user`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (getSignedInUserRequest.status === 200) {
        setUser(getSignedInUserRequest.data.user);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createOrUpdateCategory = async () => {
    const token = authState?.token;
    const baseUrl = BASEURL;

    try {
      const endpoint = category ? "edit_category" : "create_category";
      const payload = category
        ? { categoryId: category.categoryId, categoryName }
        : { categoryName, owner: user?.username };

      const request = await axios.post(`${baseUrl}/categories/${endpoint}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (request.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 3000);
      }
    } catch (error) {
      console.error(error as AxiosError);
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };

  useEffect(() => {
    getSignedInUser();
  }, []);

  return (
    <View className="w-full h-[800px] bg-[#0000006b] z-50 absolute top-0 left-0 items-center justify-center">
      {success ? <SuccessWidget message="Category Saved Successfully" /> : null}
      {error ? <ErrorWidget message="Something went wrong!" /> : null}
      <View className="bg-white p-4 w-[300px] rounded-xl">
        <FormField
          title="Category name"
          value={categoryName}
          handleChangeText={setCategoryName}
          inputStyles="w-full h-16 px-4 border-b-2 border-gray-300 rounded-xl flex-row items-center bg-transparent"
          otherStyles="mt-5 w-full"
          placeholder="Category name . . ."
          keyboardType=""
        />
        <View className="my-4 flex-row">
          <CustomButton
            title="Cancel"
            handlePress={onClose}
            containerStyles="bg-[#fff] rounded-xl justify-center items-center p-4 flex-1 text-center"
            textStyles="font-pregular text-red-950 text-base"
          />
          <CustomButton
            title={category ? "Save changes" : "Create Category"}
            handlePress={createOrUpdateCategory}
            containerStyles="bg-[#008800] ml-2 rounded-xl justify-center items-center p-4 flex-1 text-center"
            textStyles="font-pregular text-white text-base"
          />
        </View>
      </View>
    </View>
  );
};

export default CreateCategoryPopup;
