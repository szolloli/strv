import { StyleSheet, View } from "react-native";
import TextInput from "@/components/TextInput";
import Button from "@/components/Button";
import { Controller, useForm } from "react-hook-form";
import React from "react";
import { router } from "expo-router";
import Colors from "@/constants/Colors";
import { useSession } from "@/context/AuthContext";

export default function EditProfileScreen() {
  const {
    session: { firstName, email, lastName },
  } = useSession();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName,
      lastName,
      email,
    },
  });

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.textInput}
            placeholder="First name"
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            errorText={errors.firstName?.message}
          />
        )}
        name={"firstName"}
        rules={{
          required: "Title is required",
        }}
      />
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.textInput}
            placeholder="Last name"
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            errorText={errors.lastName?.message}
          />
        )}
        name={"lastName"}
        rules={{
          required: "Description is required",
        }}
      />
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.textInput}
            placeholder="Email"
            onBlur={onBlur}
            onChange={(value) => onChange(value)}
            value={value}
            errorText={errors.email?.message}
          />
        )}
        name={"email"}
        rules={{
          required: "Date is required",
        }}
      />
      <Button
        viewStyle={styles.submitButton}
        title="UPDATE"
        size="large"
        theme="success"
        onPress={handleSubmit((data) => {
          throw new Error("Functionality not implemented");
        })}
      />
      <Button
        viewStyle={styles.cancelButton}
        title="CANCEL"
        size="large"
        theme="neutral"
        onPress={() => {
          router.back();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.background.primary,
    padding: 24,
  },
  textInput: {
    marginTop: 40,
  },
  submitButton: {
    marginTop: 40,
  },
  cancelButton: {
    marginTop: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
