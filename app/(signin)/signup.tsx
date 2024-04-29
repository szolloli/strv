import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  Alert,
} from "react-native";
import Button from "@/components/Button";
import React from "react";
import Colors from "@/constants/Colors";
import TextInput from "@/components/TextInput";
import Text from "@/components/Text";
import { useForm, Controller } from "react-hook-form";
import Icon from "@/assets/svg/Icon";
import { Link } from "expo-router";
import { useEventioAuthRegister } from "@/api/eventio";
import { router } from "expo-router";

export default function SignUpScreen() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
  });
  const { mutate, isPending } = useEventioAuthRegister({
    mutation: {
      onSuccess: () => {
        router.navigate("/signin");
      },
      onError: () => {
        Alert.alert("Something went wrong. Please try again later.");
      },
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView scrollEnabled contentContainerStyle={styles.scrollableForm}>
        <View style={styles.logo}>
          <Icon />
        </View>
        <Text style={styles.textInput} variant="titleLarge">
          Get started absolutely free.
        </Text>
        <Text style={styles.subText} variant="bodyMedium">
          Enter your details below.
        </Text>
        <Controller
          control={control}
          rules={{
            required: "First name is required",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.logo}
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              errorText={errors["firstName"]?.message}
              placeholder="First name"
            />
          )}
          name="firstName"
        />
        <Controller
          control={control}
          rules={{
            required: "Last name is required",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              errorText={errors["lastName"]?.message}
              placeholder="Last name"
            />
          )}
          name="lastName"
        />
        <Controller
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Entered value does not match email format",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              errorText={errors["email"]?.message}
              placeholder="Email"
            />
          )}
          name="email"
        />
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              errorText={errors["password"]?.message}
              placeholder="Password"
            />
          )}
          rules={{
            required: "Password must be at least 6 characters long",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters long",
            },
          }}
          name="password"
        />
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              errorText={errors["repeatPassword"]?.message}
              placeholder="Repeat password"
            />
          )}
          rules={{
            validate: (value, formValues) =>
              value === formValues.password || "Passwords do not match",
          }}
          name="repeatPassword"
        />
        <View style={styles.space} />
        <Button
          viewStyle={styles.signupButton}
          title="SIGN UP"
          size="large"
          theme="success"
          loading={isPending}
          onPress={handleSubmit((data) => {
            const { repeatPassword, ...userData } = data;
            mutate({
              data: userData,
            });
          })}
        />
        <View style={styles.bottomText}>
          <Text>Already have an account? </Text>
          <Link href={"/signin"}>
            <Text style={styles.link}>Log in</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollableForm: {
    flexGrow: 1,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  logo: {
    marginTop: 56,
  },
  textInput: {
    marginTop: 40,
  },
  subText: {
    color: Colors.text.darkGray,
    marginTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  space: {
    flexGrow: 1,
  },
  bottomText: {
    flexDirection: "row",
    marginTop: 12,
  },
  link: {
    color: Colors.green,
  },
  signupButton: {
    marginTop: 24,
  },
});
