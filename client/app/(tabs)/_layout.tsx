import {
  View,
  Text,
  Image,
  ImageURISource,
  ImageRequireSource,
} from "react-native";
import React from "react";
import { Tabs } from "expo-router";

import { icons } from "../../constants";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from 'react-native';
import { useAuth } from "../context/AuthContext";

type Props = {};

interface TabIconProps {
  icon: ImageURISource | ImageRequireSource;
  color: string;
  name: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ icon, color, name, focused }) => {

  return (
    <View className="items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabLayout = (props: Props) => {
  const {onLogout} = useAuth()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#ffffff",
        tabBarStyle: {
          backgroundColor: "#450a0a",
          borderTopWidth: 1,
          borderTopColor: "#450a0a",
          height: 50,
        },
      }}
    >
      <Tabs.Screen
        name="homepage"
        options={{
          title: "",
          headerShown: true,
            headerStyle: {
              backgroundColor: "#ffe3d8",
            },
            headerRight: () => (
              <View className="px-4">
                <TouchableOpacity onPress={onLogout}>
                <Ionicons name="log-out-outline" size={30} color={'#450a0a'}/>
                </TouchableOpacity>
              </View>
            ),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.home}
              color={color}
              name="Home"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: "Journals",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.bookmark}
              color={color}
              name="Journals"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.profile}
              color={color}
              name="Profile"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
