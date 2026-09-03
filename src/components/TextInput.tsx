import { FieldError, Input, Label, TextArea, TextField } from "@heroui/react";
import React, { ComponentProps } from "react";
import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";

type Props<T extends FieldValues> = {
  label?: string;
  placeholder?: string;
  type?: ComponentProps<typeof Input>["type"];
  multiline?: boolean;
  rows?: number;
  max?: string;
  min?: string;
} & UseControllerProps<T>;

export default function TextInput<T extends FieldValues>({
  label,
  placeholder,
  type,
  multiline,
  rows = 4,
  max,
  min,
  ...controlledProps
}: Props<T>) {
  const { field, fieldState } = useController(controlledProps);

  return (
    <TextField
      aria-label={label ?? controlledProps.name}
      className="pb-3"
      isInvalid={!!fieldState.error}
    >
      {label && <Label>{label}</Label>}
      {multiline ? (
        <TextArea
          placeholder={placeholder ?? label ?? controlledProps.name}
          rows={rows}
          {...field}
        />
      ) : (
        <Input
          placeholder={placeholder ?? label ?? controlledProps.name}
          type={type}
          max={max}
          min={min}
          {...field}
        />
      )}
      <FieldError>{fieldState.error?.message}</FieldError>
    </TextField>
  );
}
