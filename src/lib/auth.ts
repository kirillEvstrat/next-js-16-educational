import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { headers } from "next/headers";
import { nextCookies } from "better-auth/next-js";
import { User } from "../../generated/prisma/browser";
import { prisma } from "./prisma";
import { getEmailHtml, sendEmail } from "./mail";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  user: {
    additionalFields: {
      profileComplete: {
        type: "boolean",
        default: false,
      },
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, token }) => {
      if (process.env.SEEDING === "true") return; // return for seeded users
      const verificationUrl = `${process.env.BETTER_AUTH_URL}/verify-email?token=${token}&callbackURL=/members`;
      void sendEmail({
        to: user.email,
        subject: "Verify your email",
        text: `Please verify your email: ${verificationUrl}`,
        html: getEmailHtml({
          heading: "Verify your email",
          body: "Please verify your email by clicking the button below.",
          buttonText: "Verify Email",
          buttonUrl: verificationUrl,
        }),
      });
    },
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, token }) => {
      const resetUrl = `${process.env.BETTER_AUTH_URL}/reset-password?token=${token}`;
      void sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Please reset your password: ${resetUrl}`,
        html: getEmailHtml({
          heading: "Reset your password",
          body: "Please reset your password by clicking the button below. Link will expire in 1 hour.",
          buttonText: "Reset Password",
          buttonUrl: resetUrl,
        }),
      });
    },
  },
  account: {
    accountLinking: {
      trustedProviders: ["github"],
      requireLocalEmailVerified: false,
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user, context) => {
          const body = context?.body as
            | {
                gender: string;
                dateOfBirth: string;
                description: string;
                city: string;
                country: string;
              }
            | undefined;

          const { gender, dateOfBirth, description, city, country } =
            body ?? {};

          if (gender && dateOfBirth && description && city && country) {
            await prisma.member.create({
              data: {
                userID: user.id,
                name: user.name,
                gender,
                dateOfBirth: new Date(dateOfBirth),
                description,
                city,
                country,
              },
            });
          }
        },
      },
    },
  },
  plugins: [nextCookies()],
});

export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user;
}

export async function requireAuthUser(): Promise<User> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("User is not authenticated");
  }

  return {
    ...session.user,
    image: session.user.image ?? null,
  };
}
