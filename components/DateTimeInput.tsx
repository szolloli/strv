import React, { useRef, useState } from "react";
import { View, StyleSheet, Pressable, Platform, Modal } from "react-native";
import Text from "@/components/Text";
import Colors from "@/constants/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";

type DateTimePickerProps = typeof DateTimePicker.defaultProps & {
  errorText?: string | undefined;
  mode: "date" | "time";
  placeholder: string | undefined;
};

export default function DateTimeInput({
  placeholder,
  mode,
  style,
  errorText,
  value,
  onChange,
  ...props
}: DateTimePickerProps & {
  errorText?: string | undefined;
  mode: "date" | "time";
}) {
  const [show, setShow] = useState(false);
  const dateRef = useRef<Date>(new Date());

  const handleChange = (event, date?: Date): void => {
    if (!date) {
      return;
    }
    dateRef.current = date;

    if (Platform.OS === "android") {
      setShow(false);
    }
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
        <Pressable
          style={{ flex: 1 }}
          onPress={() => {
            setShow(true);
          }}
        >
          <Text style={[!value && { color: Colors.text.lightGray }]}>
            {!!value
              ? mode == "date"
                ? value?.toLocaleDateString()
                : value?.toLocaleTimeString()
              : placeholder}
          </Text>
        </Pressable>
      </View>
      {Platform.OS === "ios" && (
        <Modal
          animationType="fade"
          transparent
          presentationStyle="overFullScreen"
          visible={show}
        >
          <View style={styles.overlay}>
            <View style={styles.modal}>
              <View style={styles.header}>
                <Pressable
                  onPress={() => {
                    setShow(false);
                  }}
                >
                  <Text>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    onChange(dateRef.current);
                    setShow(false);
                  }}
                >
                  <Text style={{ color: Colors.green }}>Confirm</Text>
                </Pressable>
              </View>
              <DateTimePicker
                themeVariant="light"
                mode={mode}
                value={value ?? new Date()}
                display="spinner"
                onChange={handleChange}
                {...props}
              />
            </View>
          </View>
        </Modal>
      )}
      {Platform.OS === "android" && show && (
        <DateTimePicker
          mode="date"
          value={value}
          display="spinner"
          onChange={handleChange}
        />
      )}
      {errorText && (
        <Text variant="bodyXSmall" style={styles.errorText}>
          {errorText}
        </Text>
      )}
    </View>
  );
}

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
    color: Colors.text.lightGray,
  },
  errorText: {
    marginTop: 8,
    color: Colors.red,
  },
  errorUnderline: {
    borderColor: Colors.red,
  },

  field: {
    borderRadius: 2,
    padding: 8,
    marginBottom: 8,
  },
  fieldPlaceholderText: {
    color: Colors.black,
  },
  overlay: {
    justifyContent: "flex-end",
    backgroundColor: Colors.overlay,
    flex: 1,
  },
  modal: {
    backgroundColor: Colors.background.primary,
    shadowOpacity: 0.2,
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
