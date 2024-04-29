import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import TextInput from "@/components/TextInput";
import Button from "@/components/Button";
import { Controller, useForm } from "react-hook-form";
import React from "react";
import { useEventioEventsGetById, useEventioEventsUpdate } from "@/api/eventio";
import DateTimeInput from "@/components/DateTimeInput";
import Text from "@/components/Text";
import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import Colors from "@/constants/Colors";
import { combineDateAndTime } from "@/utils/date";

type EditEventScreenInnerProps = {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: Date;
  capacity: string;
};

function EditEventScreenInner({
  id,
  title,
  description,
  date,
  time,
  capacity,
}: EditEventScreenInnerProps) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title,
      description,
      date,
      time,
      capacity,
    },
  });

  const queryClient = useQueryClient();

  const { mutate: updateEvent, isPending } = useEventioEventsUpdate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["/events"],
        });
        router.back();
      },
    },
  });

  return (
    <ScrollView
      contentContainerStyle={styles.containerPadding}
      style={styles.container}
    >
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.textInput}
            placeholder="Title"
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            errorText={errors.title?.message}
          />
        )}
        name={"title"}
        rules={{
          required: "Title is required",
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
          required: "Description is required",
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
            value={value}
            errorText={errors.capacity?.message}
          />
        )}
        name={"capacity"}
        rules={{
          required: "Capacity is required",
          min: {
            value: 0,
            message: "",
          },
        }}
      />
      <Button
        loading={isPending}
        viewStyle={styles.submitButton}
        title="CREATE"
        size="large"
        theme="success"
        onPress={handleSubmit((data) => {
          updateEvent({
            id,
            data: {
              title: data.title,
              description: data.description,
              startsAt: combineDateAndTime(data.date, data.time).toISOString(),
              capacity: parseInt(data.capacity),
            },
          });
        })}
      />
      <Button
        loading={isPending}
        viewStyle={styles.cancelButton}
        title="CANCEL"
        size="large"
        theme="neutral"
        onPress={() => router.back()}
      />
    </ScrollView>
  );
}

export default function EditEventScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: response, isLoading, isError } = useEventioEventsGetById(id);

  if (isLoading)
    return (
      <View>
        <ActivityIndicator size={"large"} />
      </View>
    );

  if (isError || !response)
    return (
      <View>
        <Text>Somethin went wrong.</Text>
      </View>
    );

  return (
    <EditEventScreenInner
      id={response.data.id}
      title={response.data.title}
      description={response.data.description}
      date={new Date(Date.parse(response.data.startsAt))}
      time={new Date(Date.parse(response?.data.startsAt))}
      capacity={response.data.capacity.toString()}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  containerPadding: {
    paddingHorizontal: 24,
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
