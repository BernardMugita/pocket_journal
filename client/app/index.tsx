import { View, Text, ScrollView, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import CustomButton from "../components/custom_button";
import { Redirect, router } from "expo-router";

type Props = {};

const WelcomeScreen = (props: Props) => {
  return (
    <SafeAreaView className="bg-red-950 h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full justify-center items-center h-full px-6 py-6">
          <View className="flex flex-row items-center gap-1">
            <View className="bg-white rounded-full">
              <Image
                className="w-[80px] h-[80px]"
                resizeMode="cover"
                source={images.logo}
              />
            </View>
            <Text className="text-4xl font-pblack text-white">
              Pocket Journal
            </Text>
          </View>
          <Image
            className="w-[400px] h-[300px]"
            resizeMode="contain"
            source={images.welcome}
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-white font-psemibold text-center">
              Take you experience to the next level with{" "}
              <Text className="text- text-yellow-300">Pocket Journal</Text>
            </Text>
          </View>
          <Text className="text-center font-pregular mt-7 text-white">
            Record journals as you go and tell you story in your own words. The
            possibilities really are limitless with Pocket Journal
          </Text>
          <CustomButton
            title="Get started"
            handlePress={() => router.push("/SignIn")}
            containerStyles="bg-white rounded-xl min-h-[62px] justify-center items-center p-6 mt-7 w-full text-center"
            textStyles="font-pbold text-red-950 text-2xl"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
