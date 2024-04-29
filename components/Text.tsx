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

type textAlign = "left" | "center" | "right";
export type TextProps = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  variant?: TextVariant;
  textAling?: textAlign;
  bold?: boolean;
};

export default function Text({
  children,
  style,
  variant = "bodyMedium",
  textAling = "left",
  bold = false,
}: TextProps) {
  return (
    <NativeText
      style={[
        styles.default,
        styles[variant],
        styles[textAling],
        bold && styles.bold,
        style,
      ]}
    >
      {children}
    </NativeText>
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: "Inter_400Regular",
  },
  left: {
    textAlign: "left",
  },
  center: {
    textAlign: "center",
  },
  right: {
    textAlign: "right",
  },
  bold: {
    fontFamily: "Inter_700Bold",
  },
  titleLarge: {
    fontSize: 24,
    lineHeight: 28,
  },
  titleMedium: {
    fontSize: 20,
    fontFamily: "Inter_500Medium",
    lineHeight: 24,
  },
  bodyLarge: {
    fontSize: 18,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 16,
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 18,
  },
  bodyXSmall: {
    fontSize: 12,
    lineHeight: 16,
  },
  overlineSmall: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
    lineHeight: 16,
    letterSpacing: 0.48,
  },
});
