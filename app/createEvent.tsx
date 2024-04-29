import { Alert, StyleSheet, View } from "react-native";
import TextInput from "@/components/TextInput";
import Button from "@/components/Button";
import { Controller, useForm } from "react-hook-form";
import React from "react";
import { useEventioEventsCreate } from "@/api/eventio";
import DateTimeInput from "@/components/DateTimeInput";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import Colors from "@/constants/Colors";

export default function ModalScreen() {
  const queryClient = useQueryClient();
  const { mutate: createEvent, isPending } = useEventioEventsCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/events"] });
        router.back();
      },
      onError: () => {
        Alert.alert("Something went wrong. Please try again later.");
      },
    },
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<{
    title: string;
    description: string;
    date: Date | undefined;
    time: Date | undefined;
    capacity: string;
  }>({
    defaultValues: {
      title: "",
      description: "",
      date: undefined,
      time: undefined,
      capacity: "",
    },
  });

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Title"
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            errorText={errors.title?.message}
          />
        )}
        name={"title"}
        rules={{
          required: "Title must be at least 3 characters long",
          minLength: {
            value: 3,
            message: "Title must be at least 3 characters long",
          },
        }}
      />
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.textInput}
            placeholder="Description"
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            errorText={errors.description?.message}
          />
        )}
        name={"description"}
        rules={{
          required: "Description must be at least 6 characters long",
          minLength: {
            value: 6,
            message: "Description must be at least 6 characters long",
          },
        }}
      />
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <DateTimeInput
            mode="date"
            style={styles.textInput}
            placeholder="Date"
            onBlur={onBlur}
            onChange={(value) => onChange(value)}
            value={value}
            errorText={errors.date?.message}
          />
        )}
        name={"date"}
        rules={{
          required: "Date is required",
        }}
      />
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <DateTimeInput
            mode="time"
            style={styles.textInput}
            placeholder="Time"
            onBlur={onBlur}
            onChange={(value) => onChange(value)}
            value={value}
            errorText={errors.time?.message}
          />
        )}
        name={"time"}
        rules={{
          required: "Time is required",
        }}
      />
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            keyboardType="number-pad"
            style={styles.textInput}
            placeholder="Capacity"
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value.toString()}
            errorText={errors.capacity?.message}
          />
        )}
        name={"capacity"}
        rules={{
          required: "Capacity is required",
        }}
      />
      <Button
        loading={isPending}
        viewStyle={styles.button}
        title="CREATE"
        size="large"
        theme="success"
        onPress={handleSubmit((data) => {
          if (!data.date || !data.time) return;
          createEvent({
            data: {
              title: data.title,
              description: data.description,
              startsAt: data.date?.toISOString(),
              capacity: parseInt(data.capacity),
            },
          });
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.background.secondary,
    padding: 24,
  },
  textInput: {
    marginTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    marginTop: 40,
  },
});
