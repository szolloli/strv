import { StyleSheet, KeyboardAvoidingView, Platform, View } from "react-native";
import Button from "@/components/Button";
import React from "react";
import Colors from "@/constants/Colors";
import TextInput from "@/components/TextInput";
import Text from "@/components/Text";
import { useForm, Controller } from "react-hook-form";
import Icon from "@/assets/svg/Icon";
import { Link } from "expo-router";
import { useEventioAuthAuthenticate } from "@/api/eventio";
import { useSession } from "@/context/AuthContext";
import { router } from "expo-router";

export default function SignInScreen() {
  const { signIn } = useSession();
  const { mutate, isPending } = useEventioAuthAuthenticate({
    mutation: {
      onSuccess: ({ data, headers }) => {
        signIn(
          headers.authorization.replace("e", "X").replace("E", "X"),
          headers["refresh-token"],
          data.id,
          data.email,
          data.firstName,
          data.lastName,
        );
        router.replace("/(tabs)/events");
      },
      onError: () => {
        setError("password", {
          message: "Oops! That email and password combination is not valid.",
        });
      },
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.logo}>
        <Icon />
      </View>
      <Text style={styles.textInput} variant="titleLarge">
        Sign in to Eventio.
      </Text>
      <Text style={styles.subText} variant="bodyMedium">
        Enter your details below.
      </Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            keyboardType="email-address"
            style={styles.logo}
            autoCapitalize="none"
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            errorText={errors["email"]?.message}
            placeholder="Email"
          />
        )}
        rules={{
          required: "Email is required",
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: "Entered value does not match email format",
          },
        }}
        name="email"
      />
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            errorText={errors["password"]?.message}
            placeholder="Password"
          />
        )}
        rules={{ required: "Password is required" }}
        name="password"
      />
      <View style={styles.space} />
      <Button
        loading={isPending}
        title="SIGN IN"
        size="large"
        theme="success"
        onPress={handleSubmit((data) => {
          mutate({
            data: {
              email: data.email,
              password: data.password,
            },
          });
        })}
      />
      <View style={styles.bottomText}>
        <Text>Don't have an account? </Text>
        <Link href={"/signup"}>
          <Text style={styles.link}>Sign up</Text>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background.primary,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  logo: {
    marginTop: 56,
  },
  textInput: {
    marginTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subText: {
    color: Colors.text.darkGray,
    marginTop: 16,
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
});
