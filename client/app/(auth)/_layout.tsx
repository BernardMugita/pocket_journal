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
      </Stack>
    </>
  );
};

export default AuthLayout;
