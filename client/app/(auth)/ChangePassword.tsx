import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  StyleSheet,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../../components/form_field";
import { useState } from "react";
import CustomButton from "../../components/custom_button";
import { Link } from "expo-router";
import axios from "axios";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import ErrorWidget from "@/components/error_widget";
import SuccessWidget from "@/components/success_widget";
import { styled } from "nativewind";
import { BASEURL } from "../context/AuthContext";

type Props = {};

type RootStackParamList = {
  sing_up: undefined;
  SignIn: undefined;
};

const AccountsBackground = styled(ImageBackground);

const ChangePassword: React.FC<Props> = () => {
  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
    email: "",
    otp: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const baseUrl = BASEURL;

  const changePassword = async () => {
    if (
      !form.email ||
      !form.otp ||
      !form.newPassword ||
      !form.confirmPassword
    ) {
      setError(true);
      setMessage("Fill in all fields");
      setTimeout(() => {
        setError(false);
      }, 3000);
    } else {
      if (form.newPassword !== form.confirmPassword) {
        setError(true);
        setMessage("Passwords don't match");
        setTimeout(() => {
          setError(false);
        }, 3000);
      } else {
        try {
          console.log("parara");
          const changePasswordRequest = await axios.post(
            `${baseUrl}/auth/passwords/change_password`,
            {
              newPassword: form.newPassword,
              email: form.email,
              otp: form.otp,
            }
          );

          console.log(changePasswordRequest.data);

          if (changePasswordRequest.status === 401) {
            setError(true);
            setMessage("Invalid OTP, Try again");
            setTimeout(() => {
              setError(false);
            }, 3000);
          }

          if (changePasswordRequest.status === 200) {
            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
              navigation.goBack();
            }, 3000);
          } else {
            setError(true);
            console.log(changePasswordRequest);
            setTimeout(() => {
              setError(false);
            }, 3000);
          }
        } catch (error) {
          setError(true);
          setMessage("Something Went wrong");
          console.log("Error:", error);
          setTimeout(() => {
            setError(false);
          }, 3000);
        }
      }
    }
  };

  return (
    <SafeAreaView className=" bg-[#ffe3d8]">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <AccountsBackground
          className="w-full justify-center items-start h-full px-6 py-6"
        >
          {success && (
            <SuccessWidget message="Password Changed, redirecting shortly" />
          )}
          {error && <ErrorWidget message={`${message}`} />}
          <Text className="font-pregular text-3xl">
            Use the OTP in your inbox to reset your password.
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e: string) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            placeholder="Enter email"
            keyboardType=""
            inputStyles="w-full h-16 px-4 bg-transparent border-2 border-red-950 rounded-xl flex-row items-center"
          />

          <FormField
            title="OTP"
            value={form.otp}
            handleChangeText={(e: string) => setForm({ ...form, otp: e })}
            placeholder="Enter OTP"
            otherStyles="mt-7"
            keyboardType=""
            inputStyles="w-full h-16 px-4 bg-transparent border-2 border-red-950 rounded-xl flex-row items-center"
          />

          <FormField
            title="Password"
            value={form.newPassword}
            handleChangeText={(e: string) =>
              setForm({ ...form, newPassword: e })
            }
            otherStyles="mt-7"
            placeholder="Enter password"
            keyboardType=""
            inputStyles="w-full h-16 px-4 bg-transparent border-2 border-red-950 rounded-xl flex-row items-center"
          />

          <FormField
            title="Confirm Password"
            value={form.confirmPassword}
            handleChangeText={(e: string) =>
              setForm({ ...form, confirmPassword: e })
            }
            otherStyles="mt-7"
            placeholder="Confirm password"
            keyboardType=""
            inputStyles="w-full h-16 px-4 bg-transparent border-2 border-red-950 rounded-xl flex-row items-center"
          />

          <View className="w-full items-end mt-4">
            <Link
              href={"RequestOTP"}
              className="text-base font-pregular text-blue-600 underline"
            >
              Request OTP?
            </Link>
          </View>

          <CustomButton
            title="Change Password"
            handlePress={changePassword}
            containerStyles="mt-7 bg-[#008800] p-6 w-full rounded-xl"
            isLoading={isSubmitting}
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

export default ChangePassword;
