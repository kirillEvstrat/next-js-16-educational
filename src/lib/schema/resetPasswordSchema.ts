import z from "zod";

const requiredString = (fieldName: string, min = 1) =>
  z
    .string({ error: `${fieldName} is required` })
    .min(min, { error: `${fieldName} is required` });

export const forgotPasswordSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
});

export const resetPasswordSchema = z
  .object({
    password: requiredString("Password", 6),
    confirmPassword: requiredString("Confirm Password", 6),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
