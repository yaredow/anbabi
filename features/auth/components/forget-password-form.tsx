"use client";

import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { forgetPassword } from "@/lib/auth-client";
import { toast } from "@/hooks/use-toast";

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

import { PasswordForgetSchema } from "../schemas";

export function ForgotPasswordForm() {
  const form = useForm<z.infer<typeof PasswordForgetSchema>>({
    resolver: zodResolver(PasswordForgetSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof PasswordForgetSchema>) {
    await forgetPassword({
      redirectTo: "/reset-password",
      email: data.email,
      fetchOptions: {
        onSuccess: () => {
          toast({
            description: "Reset instructions sent to your email",
          });
        },
        onError: () => {
          toast({
            description: "Failed to send reset instructions",
            variant: "destructive",
          });
        },
      },
    });
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Forgot Password?</CardTitle>
        <CardDescription>
          Enter your email to receive reset instructions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your@email.com"
                      {...field}
                      type="email"
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Send Reset Instructions
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
