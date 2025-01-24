import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth";
import ResetPasswordEmail from "@/emails/templates/reset-password-email";

import prisma from "./prisma";
import { resend } from "./resend";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      await resend.emails.send({
        from: process.env.SMTP_USER!,
        to: user.email,
        subject: "Reset your password",
        react: ResetPasswordEmail({
          resetPasswordLink: url,
          userFirstname: user.name.split(" ")[0],
        }),
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
