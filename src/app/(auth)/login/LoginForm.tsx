"use client";
import { authClient } from "@/lib/auth-client";
import { LoginSchema, loginSchema } from "@/lib/schema/loginSchema";
import {
  Button,
  Card,
  CardHeader,
  FieldError,
  Input,
  Separator,
  TextField,
  toast,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import SocialLogin from "./SocialLogin";

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          router.push("/members");
          router.refresh();
        },
        onError: (ctx) => {
          if (ctx.error.status === 403) {
            toast.danger("Email verification is required.");
          } else {
            toast.danger(ctx.error.message);
          }
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
      <p className="text-foreground/60 flex justify-center">
        Welcome back to NextMatch
      </p>

      <form
        className="flex flex-col gap-4 px-6 py-4"
        onSubmit={handleSubmit(onSubmit)}
      >
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

        <Button isPending={isSubmitting} type="submit" className={"w-full"}>
          Login
        </Button>
        <Link href="/forgot-password" className="text-primary hover:underline">
          Forgot Password?
        </Link>
        <Separator />
        <SocialLogin />
      </form>
    </Card>
  );
}
