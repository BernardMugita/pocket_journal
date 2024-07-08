import { View, Text } from "react-native";
import React from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "../context/AuthContext";

type Props = {};

const AuthLayout = (props: Props) => {
  const { authState } = useAuth();

  console.log( authState?.isExpired)

  if (authState?.isAuthenticated )
    return <Redirect href="/homepage" />;

  return (
    <>
      <Stack>
        <Stack.Screen
          name="sign_up"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign_in"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
};

export default AuthLayout;
