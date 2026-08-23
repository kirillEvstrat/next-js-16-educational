"use client";
import { useForm } from "react-hook-form";
import { Member } from "../../../../generated/prisma/client";
import {
  profileEditSchema,
  ProfileEditSchema,
} from "@/lib/schema/profileEditSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextField,
  Input,
  Label,
  FieldError,
  TextArea,
  Button,
  toast,
} from "@heroui/react";
import { updateProfile } from "@/server/actions/members";

type Props = {
  member: Member;
};

export default function ProfileForm({ member }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileEditSchema>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      name: member.name,
      description: member.description,
      city: member.city,
      country: member.country,
    },
  });

  const onSubmit = async (data: ProfileEditSchema) => {
    const res = await updateProfile(data);

    if (res.status === "success") {
      toast.success("Profile updated successfully");
      reset(data);
    } else {
      if (Array.isArray(res.error)) {
        res.error.forEach((issue) => {
          setError(issue.path[0] as keyof ProfileEditSchema, {
            type: "manual",
            message: issue.message,
          });
        });
      } else {
        toast.danger(res.error);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-full gap-3 "
    >
      <TextField
        aria-label="Name"
        className="w-full"
        defaultValue={member.name}
        isInvalid={!!errors.name}
      >
        <Label>Name</Label>
        <Input type="text" placeholder="Name" {...register("name")} />
        <FieldError>{errors.name?.message}</FieldError>
      </TextField>
      <TextField
        aria-label="Description"
        className="w-full"
        defaultValue={member.description}
        isInvalid={!!errors.description}
      >
        <Label>Description</Label>
        <TextArea
          rows={4}
          placeholder="Description"
          {...register("description")}
        />
        <FieldError>{errors.description?.message}</FieldError>
      </TextField>
      <TextField
        aria-label="City"
        className="w-full"
        defaultValue={member.city}
        isInvalid={!!errors.city}
      >
        <Label>City</Label>
        <Input type="text" placeholder="City" {...register("city")} />
        <FieldError>{errors.city?.message}</FieldError>
      </TextField>
      <TextField
        aria-label="country"
        className="w-full"
        defaultValue={member.country}
        isInvalid={!!errors.country}
      >
        <Label>Country</Label>
        <Input type="text" placeholder="Country" {...register("country")} />
        <FieldError>{errors.country?.message}</FieldError>
      </TextField>
      <Button
        type="submit"
        className="flex self-end mt-3"
        isPending={isSubmitting}
        isDisabled={!isDirty}
      >
        Save
      </Button>
    </form>
  );
}
