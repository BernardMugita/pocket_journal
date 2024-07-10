import { Text, ScrollView, ImageBackground, StyleSheet } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SuccessWidget from "@/components/success_widget";
import ErrorWidget from "@/components/error_widget";
import { images } from "@/constants";
import FormField from "@/components/form_field";
import CustomButton from "@/components/custom_button";
import { RouteProp, useRoute } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BASEURL } from "../context/AuthContext";
import axios, { AxiosError } from "axios";
import { styled } from "nativewind";
import { useNavigation } from "expo-router";

type Props = {};

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
  password: string;
  salt: string;
  createdAt: string;
  updatedAt: string;
}

type AccountRouteProp = RouteProp<RootStackParamList, "EditAccount">;
type AccountScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "userview"
>;

const AccountsBackground = styled(ImageBackground);

const RequestOTP = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const route = useRoute<AccountRouteProp>();

  const navigation = useNavigation();

  const [form, setForm] = useState({
    email: "",
  });

  const requestOTP = async () => {
    const baseUrl = BASEURL;

    try {
      const getOTPRequest = await axios.post(
        `${baseUrl}/auth/passwords/request_otp`,
        {
          email: form.email,
        }
      );

      if (getOTPRequest.status === 200) {
        console.log(getOTPRequest.data);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          navigation.goBack();
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

  return (
    <SafeAreaView className="bg-[#ffe3d8] flex-1 relative">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <AccountsBackground
          className="w-full justify-center items-start h-full px-6 py-6 relative"
          source={images.bg}
          imageStyle={styles.image}
        >
          {success && <SuccessWidget message="Check your email" />}
          {error && <ErrorWidget message="Something went wrong!" />}
          <Text className="font-pregular text-3xl">
            Enter your email address below to receive an OTP to use for
            resetting your password.
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e: string) => setForm({ ...form, email: e })}
            placeholder="Enter your email"
            otherStyles="mt-7"
            keyboardType="email"
            inputStyles="w-full h-16 px-4 bg-transparent border-2 rounded-xl flex-row items-center"
          />

          <CustomButton
            title="Get OTP"
            handlePress={requestOTP}
            containerStyles="mt-10 bg-[#008800] p-6 w-full rounded-xl"
            isLoading={false}
            textStyles="text-center font-pregular text-2xl text-white"
          />
        </AccountsBackground>
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

export default RequestOTP;
