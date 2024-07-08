import { View, Text } from "react-native";
import React from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "../context/AuthContext";

type Props = {};

const PagesLayout = (props: Props) => {
  const { authState } = useAuth();

  console.log(authState?.isExpired);

  if (!authState?.isAuthenticated) return <Redirect href="/sign_in" />;

  return (
    <>
      <Stack>
        <Stack.Screen
          name="single_journal"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="edit_journal"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="write_journal"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="categories"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
};

export default PagesLayout;
