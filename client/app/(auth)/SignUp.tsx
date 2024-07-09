import { View, Text, ScrollView, Image } from "react-native";
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
import { useAuth } from "../context/AuthContext";

type Props = {};

type RootStackParamList = {
  sing_up: undefined;
  sign_in: undefined;
};

type SuccessfulRegisterRequest = {
  status: string;
  user: {};
};

type FailedRegisterRequest = {
  status: string;
  message: string;
};

const SignUp: React.FC<Props> = () => {
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { onRegister } = useAuth();

  const handleRegisterRequest = async () => {
    console.log("Registering");
    const baseUrl = process.env.BASEURL;
    const new_user = {
      fullname: form.fullname,
      username: form.username,
      password: form.password,
    };

    console.log("Requesting");
    try {
      const registerRequest = await onRegister!(
        form.fullname,
        form.username,
        form.password
      );

      if (registerRequest.status == "success") {
        setSuccess(true);
        console.log(registerRequest.data);
        setTimeout(() => {
          navigation.navigate("sign_in");
        }, 3000);
      } else {
        setError(true);
        setMessage(registerRequest.message);
        console.log(registerRequest);
        setTimeout(() => {
          setError(false);
        }, 3000);
      }
    } catch (error) {
      setError(true);
      console.log("Error:", error);
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };

  return (
    <SafeAreaView className=" bg-white">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full justify-center items-start h-full px-6 py-6">
          {success && <SuccessWidget message="Account Created!" />}
          {error && <ErrorWidget message={`Failed: ${message}`} />}
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
          <Text className="font-pregular text-3xl">Create an account</Text>
          <FormField
            title="Fullname"
            value={form.fullname}
            handleChangeText={(e: string) => setForm({ ...form, fullname: e })}
            otherStyles="mt-7"
            placeholder=""
            keyboardType=""
            inputStyles="w-full h-16 px-4 bg-gray-200 rounded-xl flex-row items-center"
          />

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
            title="Sign Up"
            handlePress={handleRegisterRequest}
            containerStyles="mt-7 bg-red-950 p-6 w-full rounded-xl"
            isLoading={isSubmitting}
            textStyles="text-center font-pregular text-2xl text-white"
          />
          <View className="justify-center items-center pt-5 flex-row gap-2 w-full">
            <Text className="font-pregular text-center text-lg">
              Already have an account?{" "}
              <Link href="sign_in" className="text-red-950 font-bold text-lg">
                Sign In
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
