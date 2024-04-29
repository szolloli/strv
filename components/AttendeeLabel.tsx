import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "@/components/Text";
import Colors from "@/constants/Colors";

type AttendeeLabelProps = {
  name: string;
  self?: boolean;
};

export default function AttendeeLabel({
  name,
  self = false,
}: AttendeeLabelProps) {
  return (
    <View style={[styles.container, self ? styles.self : styles.other]}>
      <Text style={styles.text}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 100,
  },
  other: {
    backgroundColor: Colors.disabled,
  },
  self: {
    borderWidth: 1,
    borderColor: Colors.text.lightGray,
  },
  text: {
    color: Colors.text.lightGray,
  },
});
