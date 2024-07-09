import React from "react";
import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EditAccount from "./EditAccount";

type Props = {};

type RootStackParamList = {
  EditAccount: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const UserLayout = (props: Props) => {
  const { authState } = useAuth();

  if (!authState?.isAuthenticated && authState?.isExpired)
    return <Redirect href="/sign_in" />;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="EditAccount"
        component={EditAccount}
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
    </Stack.Navigator>
  );
};

export default UserLayout;
