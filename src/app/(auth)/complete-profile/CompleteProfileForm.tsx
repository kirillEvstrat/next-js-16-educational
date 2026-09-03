"use client";
import { ProfileSchema } from "@/lib/schema/resisterSchema";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { User } from "../../../../generated/prisma/browser";
import { createMemberProfile } from "@/server/actions/members";
import { toast, Button } from "@heroui/react";
import { ProfileForm } from "../register/ProfileForm";
type Props = {
  user: User;
};

export default function CompleteProfileForm({ user }: Props) {
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isValid },
  } = useForm<ProfileSchema>();

  const onSubmit = async (data: ProfileSchema) => {
    const result = await createMemberProfile(user, data);

    if (result.status === "success") {
      toast.success("Profile created successfully!");
      router.push(`/members`);
    } else {
      toast.danger(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ProfileForm control={control} />

      <Button
        type="submit"
        variant="primary"
        isDisabled={isSubmitting || !isValid}
      >
        {isSubmitting ? "Submitting..." : "Complete Profile"}
      </Button>
    </form>
  );
}
