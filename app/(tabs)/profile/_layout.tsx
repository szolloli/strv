import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, Stack } from "expo-router";
import { ActionSheetIOS, Pressable, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import Text from "@/components/Text";
import { Ionicons } from "@expo/vector-icons";
import { useSession } from "@/context/AuthContext";

export default function ProfileStackLayout() {
  const { signOut } = useSession();
  const openActionSheet = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Edit Profile", "Logout"],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
        userInterfaceStyle: "dark",
        title: "Profile Settings",
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          router.push("/(tabs)/profile/editProfile");
        } else if (buttonIndex === 2) {
          signOut();
        }
      },
    );

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: styles.header,
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
          title: "Profile",
          headerLeft: undefined,
          headerRight: () => (
            <Pressable onPress={openActionSheet}>
              <FontAwesome name="gear" size={24} />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="editProfile"
        options={{
          title: "Profile",
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

const styles = StyleSheet.create({
  header: { backgroundColor: Colors.background.primary },
});
