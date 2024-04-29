import React, { useState } from "react";
import {
  View,
  TextInput as NativeTextInput,
  TouchableOpacity,
  TextInputProps,
  StyleSheet,
} from "react-native";
import Text from "@/components/Text";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

function TextInput(
  {
    style,
    secureTextEntry,
    errorText,
    value,
    ...props
  }: TextInputProps & { errorText?: string | undefined },
  ref: React.ForwardedRef<NativeTextInput>,
) {
  const [secureText, setSecureText] = useState(secureTextEntry);

  const toggleSecureEntry = () => {
    setSecureText(!secureText);
  };
  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.inputContainer,
          !value && styles.empty,
          !!errorText && styles.errorUnderline,
        ]}
      >
        <NativeTextInput
          keyboardType="visible-password"
          autoComplete="off"
          textContentType="oneTimeCode"
          selectionColor={Colors.text.black}
          ref={ref}
          placeholderTextColor={Colors.text.lightGray}
          style={[styles.textInput, !value && styles.empty]}
          secureTextEntry={secureText}
          value={value}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={toggleSecureEntry}>
            <Ionicons
              name={secureText ? "eye" : "eye-off"}
              size={24}
              color={value ? Colors.text.black : Colors.text.lightGray}
            />
          </TouchableOpacity>
        )}
      </View>
      {errorText && (
        <Text variant="bodyXSmall" style={styles.errorText}>
          {errorText}
        </Text>
      )}
    </View>
  );
}

export default React.forwardRef<
  NativeTextInput,
  TextInputProps & { errorText?: string | undefined }
>(TextInput);

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
  },
  inputContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    fontFamily: "Inter_400Regular",
  },
  empty: {
    borderColor: Colors.text.lightGray,
    color: Colors.red,
  },
  errorText: {
    marginTop: 8,
    color: Colors.red,
  },
  errorUnderline: {
    borderColor: Colors.red,
  },
});
