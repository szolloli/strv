import React from "react";
import { router, Stack } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

import Colors from "@/constants/Colors";
import Text from "@/components/Text";
import { Ionicons } from "@expo/vector-icons";

export default function EventStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: Colors.background.primary },
        headerTitle: (props) => (
          <Text variant="bodyLarge">{props.children}</Text>
        ),
        headerLeft: () => (
          <Pressable
            onPress={() => {
              router.back();
            }}
          >
            <Ionicons size={24} name="arrow-back" />
          </Pressable>
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerLeft: undefined,
          title: "Events",
        }}
      />
      <Stack.Screen
        name="editEvent"
        options={{
          title: "Edit Event",
        }}
      />
      <Stack.Screen
        name="[eventId]"
        options={{
          title: "Event Details",
        }}
      />
    </Stack>
  );
}
