import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <SafeAreaView style={styles.safeAreaViewBottom}>
      <Slot />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaViewBottom: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
});
