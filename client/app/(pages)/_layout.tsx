import React from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "../context/AuthContext";

type Props = {};

const PagesLayout = (props: Props) => {
  const { authState } = useAuth();

  console.log(authState?.isExpired);

  if (!authState?.isAuthenticated) return <Redirect href="/sign_in" />;
  const today = new Date(Date.now());

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Stack>
        <Stack.Screen
          name="single_journal"
          options={{
            headerShown: true,
            title: "",
            headerStyle: {
              backgroundColor: "#ffe3d8",
            },
            headerTintColor: "#450a0a",
            headerTitleStyle: {
              fontWeight: "bold",
              fontFamily: "Poppins-Regular",
              color: "#450a0a",
            },
            headerTitleAlign: "left",
          }}
        />

        <Stack.Screen
          name="edit_journal"
          options={{
            headerShown: true,
            title: "",
            headerStyle: {
              backgroundColor: "#ffe3d8",
            },
            headerTintColor: "#450a0a",
            headerTitleStyle: {
              fontWeight: "bold",
              fontFamily: "Poppins-Regular",
              color: "#450a0a",
            },
            headerTitleAlign: "left",
          }}
        />
        <Stack.Screen
          name="write_journal"
          options={{
            headerShown: true,
            title: `${formattedDate}`,
            headerStyle: {
              backgroundColor: "#ffe3d8",
            },
            headerTintColor: "#450a0a",
            headerTitleStyle: {
              fontWeight: "bold",
              fontFamily: "Poppins-Regular",
              color: "#450a0a",
            },
            headerTitleAlign: "left",
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
