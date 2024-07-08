import {
  View,
  Text,
  ScrollView,
  Image,
  ImageBackground,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import { styled } from "nativewind";
import { Link, useNavigation } from "expo-router";
import { NavigationProp } from "@react-navigation/native";
import FormField from "@/components/form_field";
import JournalItem from "../../components/journal_item";

type Props = {};

type RootStackParamList = {
  sing_up: undefined;
  single_journal: undefined;
};

const JournalsBackground = styled(ImageBackground);
const IntroBanner = styled(ImageBackground);

const Journals = (props: Props) => {
  const today = new Date(Date.now());
  const [search, setSearch] = useState({
    searchQuery: "",
  });

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handlePress = () => {
    navigation.navigate("single_journal");
  };

  return (
    <SafeAreaView className="bg-[#ffe3d8] h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <JournalsBackground
          className="flex-1 items-center justify-start opacity-250"
          source={images.bg}
          resizeMode="contain"
          imageStyle={styles.image}
        >
          <View className="h-[300px] w-[100%]">
            <IntroBanner
              className="h-[300px] justify-end p-4"
              source={images.day}
              resizeMode="cover"
              imageStyle={styles.bannerOpacity}
            >
              <Text className="font-pblack text-white text-2xl">
                Today is {today.toLocaleDateString().toString()}
              </Text>
              <Text className="font-pregular text-base text-white">
                You have no new journal entries
              </Text>
            </IntroBanner>
          </View>
          <View className="px-4">
            <FormField
              title="Search"
              value={search.searchQuery}
              handleChangeText={(e: string) =>
                setSearch({ ...search, searchQuery: e })
              }
              inputStyles="w-full h-16 px-4 border-2 border-red-950 rounded-xl flex-row items-center bg-red-200"
              otherStyles="mt-5"
              placeholder="Search journals . . ."
              keyboardType=""
            />
          </View>
          <View className="p-4 w-full">
            <Text className="font-pbold text-base text-black mb-4">
              Your journals
            </Text>
            <View className="flex-col">
              <JournalItem onPress={handlePress} />
              <JournalItem onPress={handlePress} />
              <JournalItem onPress={handlePress} />
            </View>
          </View>
        </JournalsBackground>
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
  bannerOpacity: {
    opacity: 0.85,
  },
});

export default Journals;
