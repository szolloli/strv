import {
  Text as NativeText,
  StyleProp,
  TextStyle,
  StyleSheet,
} from "react-native";
import React from "react";

type TextVariant =
  | "titleLarge"
  | "titleMedium"
  | "bodyLarge"
  | "bodyMedium"
  | "bodySmall"
  | "bodyXSmall"
  | "overlineSmall";
export type TextProps = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  variant?: TextVariant;
  bold?: boolean;
};

export default function Text({
  children,
  style,
  variant = "bodyMedium",
  bold = false,
}: TextProps) {
  return (
    <NativeText
      style={[styles.default, styles[variant], bold && styles.bold, style]}
    >
      {children}
    </NativeText>
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: "Inter",
    textAlign: "left",
  },
  bold: {
    fontWeight: "700",
  },
  titleLarge: {
    fontSize: 24,
    fontWeight: "400",
    lineHeight: 28,
  },
  titleMedium: {
    fontSize: 20,
    fontWeight: "500",
    lineHeight: 24,
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: "400",
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 18,
  },
  bodyXSmall: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
  },
  overlineSmall: {
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 16,
    letterSpacing: 0.48,
  },
});
