import z from "zod";

export const profileEditSchema = z.object({
  name: z.string().min(1, { error: "Name must be at least 1 character long" }),
  description: z
    .string()
    .min(1, { error: "Description must be at least 1 character long" }),
  city: z.string().min(1, { error: "City must be at least 1 character long" }),
  country: z
    .string()
    .min(1, { error: "Country must be at least 1 character long" }),
});

export type ProfileEditSchema = z.infer<typeof profileEditSchema>;
