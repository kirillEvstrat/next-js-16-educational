import TextInput from "@/components/TextInput";
import { RegisterSchema } from "@/lib/schema/resisterSchema";
import { format, subYears } from "date-fns";
import React from "react";
import { Control } from "react-hook-form";

type Props = {
  control: Control<RegisterSchema>;
};

export default function UserForm({ control }: Props) {
  return (
    <div>
      <TextInput control={control} name="name" label="Name" />
      <TextInput control={control} name="email" label="Email" type="email" />
      <TextInput
        control={control}
        name="password"
        label="Password"
        type="password"
      />
      <TextInput
        control={control}
        name="confirmPassword"
        label="Confirm Password"
        type="password"
      />
    </div>
  );
}
