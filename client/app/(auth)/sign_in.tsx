import { View, Text, ScrollView, Image } from "react-native";
import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../../components/form_field";
import { useState } from "react";
import CustomButton from "../../components/custom_button";
import { Link, router } from "expo-router";
import SuccessWidget from "@/components/success_widget";
import ErrorWidget from "@/components/error_widget";
import { useAuth } from "../context/AuthContext";

type Props = {};

const SignIn = (props: Props) => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(false);

  const { onLogin } = useAuth();

  const handleLoginRequest = async () => {
    try {
      const loginRequest = await onLogin!(form.username, form.password);

      if (loginRequest.status == "success") {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          router.replace("homepage");
        }, 3000);
      } else {
        setError(true);
        console.log(loginRequest);
        setMessage(loginRequest.message);
        setTimeout(() => {
          setError(false);
        }, 3000);
      }
    } catch (error) {
      setError(true);
      console.log(error);
      console.log("Error:", error);
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };

  return (
    <SafeAreaView className=" bg-white">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full justify-center items-start h-full px-6 py-6 relative">
          {success && <SuccessWidget message="Login Successful" />}
          {error && <ErrorWidget message="Login Failed" />}
          <View className="flex flex-row items-center gap-1 mb-10">
            <View className="bg-red-950 rounded-full">
              <Image
                className="w-[80px] h-[80px]"
                resizeMode="cover"
                source={images.logowhite}
              />
            </View>
            <View className="items-center">
              <Text className="text-4xl font-pblack text-white">Pocket</Text>
              <Text className="text-4xl font-pblack text-white">Journal</Text>
            </View>
          </View>
          <Text className="font-pregular text-3xl">Login to your account</Text>
          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e: string) => setForm({ ...form, username: e })}
            otherStyles="mt-7"
            placeholder=""
            keyboardType=""
            inputStyles="w-full h-16 px-4 bg-gray-200 rounded-xl flex-row items-center"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e: string) => setForm({ ...form, password: e })}
            placeholder=""
            otherStyles="mt-7"
            keyboardType="password"
            inputStyles="w-full h-16 px-4 bg-gray-200 rounded-xl flex-row items-center"
          />

          <CustomButton
            title="Sign In"
            handlePress={handleLoginRequest}
            containerStyles="mt-7 bg-red-950 p-6 w-full rounded-xl"
            isLoading={isSubmitting}
            textStyles="text-center font-pregular text-2xl text-white"
          />
          <View className="justify-center items-center pt-5 flex-row gap-2 w-full">
            <Text className="font-pregular text-center text-lg">
              Dont have an account?{" "}
              <Link href="sign_up" className="text-red-950 font-bold text-lg">
                Sign Up
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
