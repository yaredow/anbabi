"use client";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDeleteAccount } from "../api/use-delete-account";
import { useConfirm } from "@/hooks/use-confirm";
import { useUpdatePassword } from "../api/use-update-password";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PasswordUpdateSchema,
  PasswordUpdateData,
} from "@/features/auth/schemas";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";

export function UserProfileSettingsCard() {
  const { deleteAccount, isPending: isDeleteAccountPending } =
    useDeleteAccount();
  const { updatePassword, isPending: isUpdateAccountPending } =
    useUpdatePassword();

  const isLoading = isDeleteAccountPending || isUpdateAccountPending;

  const [ConfirmationDialog, confirm] = useConfirm({
    title: "Delete Account",
    message:
      "Are you sure you want to delete your account? This process is irreversible and will cause data loss.",
    variant: "destructive",
  });

  const handleDeletAccount = async () => {
    const ok = await confirm();

    if (ok) {
      deleteAccount();
    }
  };

  const form = useForm<PasswordUpdateData>({
    resolver: zodResolver(PasswordUpdateSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleUpdatePassword = (data: PasswordUpdateData) => {
    updatePassword(
      { json: data },
      {
        onSuccess: () => {
          form.reset();
          toast({
            description: "Password updated successfully",
          });
        },
        onError: (error) => {
          toast({
            description: error.message,
            variant: "destructive",
          });
        },
      },
    );
  };

  return (
    <>
      <ConfirmationDialog />
      <div className="bg-white shadow rounded-lg p-6 w-full max-w-2xl mx-auto">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Profile Settings</h2>
          <p className="text-gray-600">
            Manage your account settings and preferences.
          </p>
        </div>
        <div>
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="flex justify-center w-full">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="Enter your email"
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" placeholder="Enter your username" />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="password">
              <div className="space-y-4 py-4">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleUpdatePassword)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter your current password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter your new password"
                              {...field}
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
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirm your new password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isLoading}>
                      Update Password
                    </Button>
                  </form>
                </Form>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="flex flex-col items-start space-y-4 mt-4">
          <div className="w-full">
            <Button
              variant="destructive"
              className="w-full"
              disabled={isLoading}
              onClick={handleDeletAccount}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
