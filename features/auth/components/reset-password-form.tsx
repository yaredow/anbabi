"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { PasswordResetData, PasswordResetSchema } from "../schemas";
import { resetPassword } from "@/lib/auth-client";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = new URLSearchParams(window.location.search).get("token");

  if (!token) {
    return <div>Invalid token</div>;
  }

  const form = useForm<PasswordResetData>({
    resolver: zodResolver(PasswordResetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleResetPassword = async (values: PasswordResetData) => {
    try {
      const { data, error } = await resetPassword({
        newPassword: values.password,
        token,
      });

      if (error) {
        console.error("Error resetting password:", error);
        // Handle error (e.g., show a notification)
      } else {
        console.log("Password reset successful:", data);
        // Handle success (e.g., redirect to login page)
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      // Handle unexpected error (e.g., show a notification)
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleResetPassword)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting || !token}
            >
              {form.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Reset Password
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
