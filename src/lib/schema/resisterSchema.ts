import z, { superRefine } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, { error: "Name is required" }),
    email: z.email({ error: "Invalid email address" }),
    password: z
      .string()
      .min(6, { error: "Password must be at least 6 characters long" }),

    confirmPassword: z.string(),
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

export type RegisterSchema = z.infer<typeof registerSchema>;
