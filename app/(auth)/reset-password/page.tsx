"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { forgetPassword } from "@/lib/auth-client";
import { useState } from "react";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSendPasswordResetEmail = async () => {
    setIsLoading(true);
    const { data, error } = await forgetPassword({
      email: "yaredyilma11@gamil.com",
      fetchOptions: {
        onSuccess: () => {
          toast({
            description: "Password reset email sent",
          });
          setIsLoading(false);
        },
        onError: () => {
          toast({
            description: "Something went wrong. Please try again!",
            variant: "destructive",
          });
          setIsLoading(false);
        },
      },
    });
  };

  return (
    <div className="items-center justify-center mx-auto min-h-screen">
      <Button disabled={isLoading} onClick={handleSendPasswordResetEmail}>
        {isLoading ? "Sending OTP..." : "Send Password Reset OTP"}
      </Button>
    </div>
  );
}
