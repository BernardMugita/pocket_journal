import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";

type Props = {};

const HomePage = (props: Props) => {
  return (
    <SafeAreaView className="bg-gray-150 h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="flex-1 items-center justify-start m-2">
          <View className="flex-row items-center h-[4rem] p-2">
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
          <View className="flex-col items-start w-full mb-4">
            <Text className="font-pbold text-base text-left mb-4 text-red-950">
              Recent entries:
            </Text>
            <View
              style={styles.shadow}
              className="
            shadow-black-200
              p-4
              rounded-xl
              shadow-xl
              w-full
              h-32
              bg-white
              justify-center
            "
            >
              <View className="flex-row justify-between">
                <Text className="font-pbold text-base">Journal name: </Text>
                <Text className="font-pregular text-base">Journal name: </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="font-pbold text-base">Writen on: </Text>
                <Text className="font-pregular text-base">Writen on: </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="font-pbold text-base">Category: </Text>
                <Text className="font-pregular text-base">Category: </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="font-pbold text-base">Word count: </Text>
                <Text className="font-pregular text-base">Word count: </Text>
              </View>
            </View>
          </View>
          <View className="flex-col items-start w-full">
            <Text className="font-pbold text-base text-left mb-4 text-red-950">
              Quick actions:
            </Text>
            <View className="flex-row gap-2 mb-4">
              <TouchableOpacity>
                <Text>Write</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  shadow: {
    elevation: 100,
  },
});

export default HomePage;
