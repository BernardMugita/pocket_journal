import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { styled } from "nativewind";
import { images } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BASEURL, useAuth } from "../context/AuthContext";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import axios, { AxiosError } from "axios";
import SuccessWidget from "@/components/success_widget";
import ErrorWidget from "@/components/error_widget";

type Props = {};
const ProfileBackgorund = styled(ImageBackground);

type RootStackParamList = {
  EditAccount: { userDetails: User };
  userview: {
    screen: string;
    params: { userDetails: User };
  };
};

interface User {
  userId: string;
  role: string;
  profile: string;
  fullname: string;
  username: string;
  email: string;
  password: string;
  salt: string;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  total_user_journals: number;
  most_popular_day: string;
  journal_count: number;
  most_popular_month: string;
  most_popular_category: string;
  unique_categories: number;
  last_month_journals: number;
  last_week_journals: number;
  yesterday_journals: number;
}

type AccountScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "userview"
>;

const Profile = ({ navigation }: AccountScreenProps) => {
  const { authState, onLogout } = useAuth();
  const [user, setUser] = useState({});
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [stats, setStats] = useState<Stats>();

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

  const deleteAccount = async () => {
    const token = authState?.token;
    const baseUrl = BASEURL;

    try {
      const deleteAccountRequest = await axios.post(
        `${baseUrl}/users/delete_user_account`,
        {
          userId: (user as User).userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (deleteAccountRequest.status === 200) {
        console.log(deleteAccountRequest.data);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onLogout;
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
    getUserJournalsSummary()
  }, []);

  const handleNavigate = () => {
    navigation.navigate("userview", {
      screen: "EditAccount",
      params: { userDetails: user as User },
    });
  };

  const confirmDelete = () => {
    Alert.alert("Warning", "Are you sure you want to delete your account?", [
      {
        text: "Cancel",
        onPress: () => {},
      },
      {
        text: "Delete",
        onPress: () => {
          deleteAccount();
        },
      },
    ]);
  };

  const getUserJournalsSummary = async () => {
      const token = authState?.token;
      const baseUrl = BASEURL;
  
      try {
        const getUserJournalStatsRequest = await axios.post(
          `${baseUrl}/summary/journal_summary`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
  
        if (getUserJournalStatsRequest.status === 200) {
          setStats(getUserJournalStatsRequest.data.stats as Stats);
        }
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <SafeAreaView className="bg-[#ffe3d8] flex-1 relative">
      <ScrollView
        className="bg-[#ffe3d8]"
        contentContainerStyle={{ height: "100%" }}
      >
        {success && <SuccessWidget message="Account Deleted" />}
        {error && <ErrorWidget message="Something went wrong!" />}
        <ProfileBackgorund
          className="flex-1 items-center justify-start m-2 h-full"
          source={images.bg}
          resizeMode="contain"
          imageStyle={styles.image}
        >
          <View className="w-full flex-row gap-2 justify-end mb-20">
            <TouchableOpacity
              className="bg-[#0088006b] p-3 rounded-xl flex-row items-center"
              onPress={handleNavigate}
            >
              <Text className="text-base font-pregular text-[#008000] mr-2">
                Edit
              </Text>
              <Ionicons name="pencil-outline" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={confirmDelete}
              className="bg-[#ff00006b] p-3 rounded-xl flex-row items-center"
            >
              <Text className="text-base font-pregular text-[#ff0000] mr-2">
                Delete
              </Text>
              <Ionicons name="trash-bin-outline" />
            </TouchableOpacity>
          </View>
          <View className="w-full h-[350px] items-center justify-center flex-col">
            <View className="items-center flex-col mb-10">
              <View className="w-[150px] h-[150px] bg-red-950 items-center justify-center flex-col mb-4 border-4 rounded-xl">
                <Text className="text-8xl font-psemibold">
                  {(user as User)?.username?.charAt(0)}
                </Text>
              </View>
              <Text className="text-4xl font-pbold ">
                {(user as User)?.username}
              </Text>
            </View>
            <View className="flex-row items-center mb-4">
              <View className="flex-col items-center gap-1 flex-1">
                <Text className="text-2xl font-pbold text-red-950">{stats?.journal_count ? stats?.journal_count : "0"}</Text>
                <Text className="text-base font-pregular text-white">
                  Entries
                </Text>
              </View>
              <View className="flex-col items-center gap-1 flex-1">
                <Text className="text-2xl font-pbold text-red-950">{stats?.unique_categories ? stats?.unique_categories : "0"}</Text>
                <Text className="text-base font-pregular text-white">
                  Categories
                </Text>
              </View>
            </View>
          </View>
          <View className="w-full px-10 pt-5 border-t-2 border-red-950 rounded-xl">
            <Text className="text-base font-pbold">User Details</Text>
          </View>
          <View className="w-full px-10 mt-5 flex-row justify-between">
            <Text className="text-base font-pbold">Fullname:</Text>
            <Text className="text-base font-pregular">
              {(user as User)?.fullname}
            </Text>
          </View>
          <View className="w-full px-10 mt-5 flex-row justify-between">
            <Text className="text-base font-pbold">Username:</Text>
            <Text className="text-base font-pregular">
              {(user as User)?.username}
            </Text>
          </View>
          <View className="w-full px-10 mt-5 flex-row justify-between">
            <Text className="text-base font-pbold">Email:</Text>
            <Text className="text-base font-pregular">
              {(user as User)?.email}
            </Text>
          </View>
        </ProfileBackgorund>
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
  text: {
    fontFamily: "Poppins-Bold",
  },
});

export default Profile;
