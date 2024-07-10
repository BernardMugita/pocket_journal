import { View, Text } from "react-native";
import React from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "../context/AuthContext";

type Props = {};

const AuthLayout = (props: Props) => {
  const { authState } = useAuth();

  // console.log( authState?.isExpired)

  if (authState?.isAuthenticated && !authState.isExpired)
    return <Redirect href="Homepage" />;

  return (
    <>
      <Stack>
        <Stack.Screen
          name="SignUp"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="SignIn"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ChangePassword"
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
          name="RequestOTP"
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
      </Stack>
    </>
  );
};

export default AuthLayout;
