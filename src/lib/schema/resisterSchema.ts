import z, { superRefine } from "zod";
import { calculateAge } from "../utils";

const requiredString = (fieldName: string, min = 1) =>
  z
    .string({ error: `${fieldName} is required` })
    .min(min, { error: `${fieldName} is required` });

export const registerSchema = z
  .object({
    name: requiredString("Name"),
    email: z.email({ error: "Invalid email address" }),
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

export const profileSchema = z.object({
  gender: requiredString("Gender"),
  description: requiredString("Description", 10),
  city: requiredString("City", 1),
  country: requiredString("Country", 1),
  dateOfBirth: requiredString("Date of Birth").refine(
    (val) => {
      const age = calculateAge(val);
      return age >= 18;
    },
    {
      error: "You must be at least 18 years old",
    },
  ),
});

export const combinedRegisterSchema = registerSchema.and(profileSchema);

export type RegisterSchema = z.infer<typeof registerSchema>;
export type ProfileSchema = z.infer<typeof profileSchema>;
export type CombinedRegisterSchema = z.infer<typeof combinedRegisterSchema>;
