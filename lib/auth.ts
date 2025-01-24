import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";

import prisma from "./prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        console.log({ email });
        const subjectMapping = {
          "sign-in": "Your Login OTP Code",
          "forget-password": "Your Password Reset OTP Code",
          "email-verification": "Your Email Verification OTP Code",
        };

        const textMapping = {
          "sign-in": `Your OTP code is ${otp}`,
          "forget-password": `Your password reset OTP code is ${otp}`,
          "email-verification": `Your email verification OTP code is ${otp}`,
        };

        try {
          await resend.emails.send({
            from: process.env.SMTP_USER!,
            to: email,
            subject: subjectMapping[type] || "Your OTP Code",
            text: textMapping[type] || `Your OTP code is ${otp}`,
          });
        } catch (error) {
          console.error("Error sending OTP email:", error);
          throw new Error("Failed to send OTP email. Please try again later.");
        }
      },
      otpLength: 8,
      expiresIn: 600,
    }),
  ],
});
