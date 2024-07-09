import React from "react";
import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SingleJournal from "./SingleJournal";
import EditJournal from "./EditJournals";
import WriteJournal from "./WriteJournal";
import Journals from "./Journals";

type Props = {};

type RootStackParamList = {
  single_journal: undefined;
  edit_journal: undefined;
  write_journal: undefined;
  Journals: { categoryName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const PagesLayout = (props: Props) => {
  const { authState } = useAuth();

  if (!authState?.isAuthenticated && authState?.isExpired)
    return <Redirect href="/sign_in" />;
  const today = new Date(Date.now());

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="single_journal"
        component={SingleJournal}
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
        component={EditJournal}
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
        component={WriteJournal}
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
        name="Journals"
        component={Journals}
        options={({ route }) => ({
          title: `Journals of ${route.params?.categoryName}`,
          headerShown: true,
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
        })}
      />
    </Stack.Navigator>
  );
};

export default PagesLayout;
