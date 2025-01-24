"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { emailOtp } from "@/lib/auth-client";
import { useState } from "react";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSendPasswordResetEmail = async () => {
    setIsLoading(true);
    await emailOtp.sendVerificationOtp({
      email: "yaredyilma11@gmail.com",
      type: "forget-password",
      fetchOptions: {
        onSuccess: () => {
          toast({
            description: "OTP sent to your email.",
          });
          setIsLoading(false);
        },
        onError: () => {
          toast({
            description: "Failed to send OTP email. Please try again later.",
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
