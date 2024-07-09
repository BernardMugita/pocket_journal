import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import CustomButton from "@/components/custom_button";
import { router } from "expo-router";
import { styled } from "nativewind";

type Props = {};

const HomeBackground = styled(ImageBackground);

const Homepage = (props: Props) => {
  return (
    
      <ScrollView className="bg-[#ffe3d8]" contentContainerStyle={{ height: "100%" }}>
        <HomeBackground
          className="flex-1 items-center justify-start m-2 h-full"
          source={images.bg}
          resizeMode="contain"
          imageStyle={styles.image}
        >
          <View className="flex-row items-center h-[4rem] p-2 border-b-red-200 border-b-2 mb-4">
            <Image
              className="w-[80px] h-[80px]"
              resizeMode="cover"
              source={images.logo}
            ></Image>
            <View className="flex-1 items-start flex-col">
              <Text className="text-3xl font-pblack">Welcome back!</Text>
              <Text className="text-2xl font-pregular">Username</Text>
            </View>
          </View>
          <View className="flex-row gap-2 mb-4">
            <View
              className="h-[2rem] flex-1 bg-white rounded-xl p-4"
              style={styles.shadow}
            >
              <Text className="font-pbold text-red-950 text-base">
                Journal entries:
              </Text>
              <Text>4</Text>
            </View>
            <View
              className="h-[2rem] flex-1 bg-white rounded-xl p-4"
              style={styles.shadow}
            >
              <Text className="font-pbold text-red-950 text-base">
                Categories:
              </Text>
              <Text>4</Text>
            </View>
          </View>
          <View className="flex-col items-start w-full">
            <Text className="font-pbold text-base text-left text-red-950 mb-4">
              Quick actions
            </Text>
            <View className="flex-row justify-between mb-4 w-full mx">
              <CustomButton
                title="Write"
                handlePress={() => router.push("/sign_in")}
                containerStyles="bg-red-950 rounded-xl justify-center items-center p-4 flex-1 text-center"
                textStyles="font-pregular text-white text-base"
              />
              <View className="p-1"></View>
              <CustomButton
                title="Get started"
                handlePress={() => router.push("/sign_in")}
                containerStyles="bg-red-950 rounded-xl justify-center items-center p-4 flex-1 text-center"
                textStyles="font-pregular text-white text-base"
              />
            </View>
          </View>
          <View className="flex-col items-start w-full mb-4">
            <Text className="font-pbold text-base text-left mb-4 text-red-950">
              Recent entries
            </Text>
            <View
              style={styles.shadow}
              className="
            shadow-black-200
              p-4
              rounded-xl
              shadow-xl
              w-full
              h-52
              bg-white
              justify-end
            "
            >
              <View className="flex-1 mb-4">
                <Image
                  resizeMode="cover"
                  className="h-full w-full"
                  source={images.placeholder}
                ></Image>
              </View>
              <View className="flex-row justify-between">
                <Text className="font-pbold text-base">Journal name: </Text>
                <Text className="font-pregular text-base">Journal Name</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="font-pbold text-base">Writen on: </Text>
                <Text className="font-pregular text-base">02-09-2024</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="font-pbold text-base">Category: </Text>
                <Text className="font-pregular text-base">progress</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="font-pbold text-base">Word count: </Text>
                <Text className="font-pregular text-base">250</Text>
              </View>
            </View>
          </View>
        </HomeBackground>
      </ScrollView>
    
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

export default Homepage;
