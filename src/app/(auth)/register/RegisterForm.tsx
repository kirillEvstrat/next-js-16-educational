"use client";
import { ProfileForm } from "./ProfileForm";
import {
  ProfileSchema,
  profileSchema,
  registerSchema,
  RegisterSchema,
} from "@/lib/schema/resisterSchema";
import { Button, Card, CardHeader, toast } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import UserForm from "./UserForm";
import { authClient } from "@/lib/auth-client";

export default function RegisterForm() {
  const router = useRouter();

  const [activeStep, setActiveStep] = useState(0);
  const isLastStep = activeStep === 1;

  const userForm = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const profileForm = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    mode: "onTouched",
  });

  const onNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const onBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const onSubmit = async () => {
    const userData = userForm.getValues();
    const profileData = profileForm.getValues();
    const data = { ...userData, ...profileData, profileComplete: true };

    await authClient.signUp.email(data, {
      onSuccess: () => {
        toast.success(
          "Registration successful. Please check your email to verify",
        );
        router.push("/");
        router.refresh();
      },
      onError: (ctx) => {
        toast.danger(ctx.error.message);
      },
    });
  };

  return (
    <Card className="w-md shadow-xl">
      <CardHeader className="flex flex-col items-center justify-center" />
      <div className="flex flex-col items-center justify-center">
        <div>
          <h1 className="text-3xl font-semibold">Register</h1>
        </div>
      </div>
      <p className="text-foreground/60 flex justify-center">Sign up</p>

      <form
        className="flex flex-col gap-4 px-6 py-4"
        onSubmit={
          isLastStep
            ? profileForm.handleSubmit(onSubmit)
            : userForm.handleSubmit(onNext)
        }
      >
        {activeStep === 0 && <UserForm control={userForm.control} />}
        {activeStep === 1 && <ProfileForm control={profileForm.control} />}

        <div className="flex justify-between gap-2">
          {activeStep > 0 && (
            <Button
              type="button"
              variant="secondary"
              onClick={onBack}
              className={"flex-1"}
            >
              Back
            </Button>
          )}
          {activeStep < 1 && (
            <Button
              type="button"
              variant="secondary"
              onClick={onNext}
              className={"flex-1"}
            >
              Next
            </Button>
          )}
          <Button
            isPending={
              isLastStep
                ? profileForm.formState.isSubmitting
                : userForm.formState.isSubmitting
            }
            type="submit"
            className={"flex-1"}
          >
            {isLastStep ? "Register" : "Next"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
