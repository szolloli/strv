import React from "react";
import { Controller, FieldValues, RegisterOptions } from "react-hook-form";
import TextInput from "./TextInput";

export default function FormTextInput({
  placeholder,
  name,
  rules,
  control,
  secureTextEntry,
  errorText,
}: {
  placeholder: string;
  name: string;
  control: any;
  secureTextEntry: boolean;
  errorText: string | undefined;
  rules:
    | Omit<
        RegisterOptions<FieldValues>,
        "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
      >
    | undefined;
}) {
  return (
    <Controller
      control={control}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          autoCapitalize="none"
          secureTextEntry={secureTextEntry}
          onBlur={onBlur}
          onChangeText={(value) => onChange(value)}
          value={value}
          errorText={errorText}
          placeholder={placeholder}
        />
      )}
      name={name}
      rules={rules}
    />
  );
}
