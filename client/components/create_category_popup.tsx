import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import FormField from "./form_field";
import CustomButton from "./custom_button";
import { BASEURL, useAuth } from "@/app/context/AuthContext";
import axios, { AxiosError } from "axios";
import SuccessWidget from "./success_widget";
import ErrorWidget from "./error_widget";

type Props = {
  onClose: () => void;
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

const CreateCategoryPopup: React.FC<Props> = ({ onClose }) => {
  const [category, setCategory] = useState({
    categoryName: "",
  });

  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const { authState } = useAuth();
  const [user, setUser] = useState({});
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
        setUser(getSignedInUserRequest.data.user as User);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createCategory = async () => {
    const token = authState?.token;
    const baseUrl = BASEURL;

    try {
      const createCategoryRequest = await axios.post(
        `${baseUrl}/categories/create_category`,
        {
          categoryName: category.categoryName,
          owner: (user as User)?.username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (createCategoryRequest.status === 200) {
        const category = createCategoryRequest.data.category;
        console.log(category);
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
      {success ? (
        <SuccessWidget message="Journal Created Successfully" />
      ) : null}
      {error ? <ErrorWidget message="Something went wrong!" /> : null}
      <View className="bg-white p-4 w-[300px] rounded-xl">
        <FormField
          title="Journal name"
          value={category.categoryName}
          handleChangeText={(e: string) =>
            setCategory({ ...category, categoryName: e })
          }
          inputStyles="w-full h-16 px-4 border-b-2 border-gray-300 rounded-xl flex-row items-center bg-transparent"
          otherStyles="mt-5 w-full"
          placeholder="Journal name . . ."
          keyboardType=""
        />
        <View className="my-4 flex-row">
          <CustomButton
            title="Cancel"
            handlePress={() => {
              onClose();
            }}
            containerStyles="bg-[#fff] rounded-xl justify-center items-center p-4 flex-1 text-center"
            textStyles="font-pregular text-red-950 text-base"
          />
          <CustomButton
            title="Save changes"
            handlePress={() => {
              createCategory();
            }}
            containerStyles="bg-[#008800] ml-2 rounded-xl justify-center items-center p-4 flex-1 text-center"
            textStyles="font-pregular text-white text-base"
          />
        </View>
      </View>
    </View>
  );
};

export default CreateCategoryPopup;
