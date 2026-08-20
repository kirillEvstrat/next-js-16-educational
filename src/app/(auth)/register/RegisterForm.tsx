"use client";
import { authClient } from "@/lib/auth-client";
import { registerSchema, RegisterSchema } from "@/lib/schema/resisterSchema";
import {
  Button,
  Card,
  CardHeader,
  FieldError,
  Input,
  TextField,
  toast,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    await authClient.signUp.email(
      {
        email: data.email,
        password: data.password,
        name: data.name,
      },
      {
        onSuccess: () => {
          router.push("/members");
        },
        onError: (ctx) => {
          toast.danger(ctx.error.message);
        },
      },
    );
  };

  return (
    <Card className="w-md shadow-xl">
      <CardHeader className="flex flex-col items-center justify-center" />
      <div className="flex flex-col items-center justify-center">
        <div>
          <h1 className="text-3xl font-semibold">login</h1>
        </div>
      </div>
      <p className="text-foreground/60 flex justify-center">Sing up</p>

      <form
        className="flex flex-col gap-4 px-6 py-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextField
          aria-label="name"
          className="w-full"
          defaultValue=""
          isInvalid={!!errors.name}
        >
          <Input placeholder="Name" {...register("name")} />
          <FieldError>{errors.name?.message}</FieldError>
        </TextField>
        <TextField
          aria-label="Email"
          className="w-full"
          defaultValue=""
          isInvalid={!!errors.email}
        >
          <Input placeholder="Email" {...register("email")} />
          <FieldError>{errors.email?.message}</FieldError>
        </TextField>

        <TextField
          aria-label="Password"
          className="w-full"
          defaultValue=""
          isInvalid={!!errors.password}
        >
          <Input
            type="password"
            placeholder="Password"
            {...register("password")}
          />
          <FieldError>{errors.password?.message}</FieldError>
        </TextField>

        <TextField
          aria-label="Confirm Password"
          className="w-full"
          defaultValue=""
          isInvalid={!!errors.confirmPassword}
        >
          <Input
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword")}
          />
          <FieldError>{errors.confirmPassword?.message}</FieldError>
        </TextField>

        <Button isPending={isSubmitting} type="submit" className={"w-full"}>
          Register
        </Button>
      </form>
    </Card>
  );
}
