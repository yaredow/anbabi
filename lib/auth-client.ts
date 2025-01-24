import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

export const { signIn, signUp, signOut, useSession, emailOtp } =
  createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [emailOTPClient()],
  });
