import {
  StyleProp,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import Text from "./Text";

type ButtonTheme = "disabled" | "neutral" | "danger" | "success";
type ButtonSize = "large" | "small";

const ButtonColors = {
  disabled: Colors.disabled,
  neutral: Colors.background.secondary,
  danger: Colors.red,
  success: Colors.green,
};

const ButtonFontColors = {
  disabled: Colors.text.lightGray,
  neutral: Colors.text.black,
  danger: Colors.text.white,
  success: Colors.text.white,
};

export type ButtonProps = {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  viewStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  size?: ButtonSize;
  theme?: ButtonTheme;
  loading?: boolean;
  disabled?: boolean;
};

export default function Button({
  title,
  onPress,
  viewStyle,
  textStyle,
  size = "small",
  theme = "disabled",
  loading = false,
  disabled = false,
}: ButtonProps) {
  const buttonStyles = getButtonStyle(theme, size);

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        buttonStyles.body,
        disabled && styles.disabled,
        viewStyle,
      ]}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text
          bold
          variant={size == "small" ? "bodySmall" : "bodyMedium"}
          style={[buttonStyles.text, textStyle]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  disabled: {
    backgroundColor: Colors.disabled,
  },
  large: {
    minHeight: 56,
    alignSelf: "stretch",
    borderRadius: 8,
  },
  small: {
    minHeight: 32,
    minWidth: 100,
  },
});

const getButtonStyle = (theme: ButtonTheme, size: ButtonSize) => {
  return StyleSheet.create({
    text: {
      color: ButtonFontColors[theme],
    },
    body: {
      ...styles[size],
      backgroundColor: ButtonColors[theme],
    },
  });
};
