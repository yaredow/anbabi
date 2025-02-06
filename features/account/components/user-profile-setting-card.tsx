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
import { UpdateUserData, UpdateUserSchema } from "../schema";
import { useUpdateUserProfile } from "../api/use-update-user-profile";

type UserProfileSettingsCardProps = {
  onClose: () => void;
};

export function UserProfileSettingsCard({
  onClose,
}: UserProfileSettingsCardProps) {
  const { deleteAccount, isPending: isDeleteAccountPending } =
    useDeleteAccount();
  const { updatePassword, isPending: isUpdateAccountPending } =
    useUpdatePassword();

  const { updateProfile, isPending } = useUpdateUserProfile();

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

  const accountForm = useForm<UpdateUserData>({
    defaultValues: {
      email: "",
      name: "",
    },
    resolver: zodResolver(UpdateUserSchema),
  });

  const accountSettingForm = useForm<PasswordUpdateData>({
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
          accountSettingForm.reset();
          toast({
            description: "Password updated successfully",
          });
          onClose();
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

  const handleUpdateUserData = (data: UpdateUserData) => {
    updateProfile(
      { form: data },
      {
        onSuccess: () => {
          toast({
            description: "Account updated successfully",
          });
          onClose();
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
                <Form {...accountSettingForm}>
                  <form
                    className="space-y-4"
                    onSubmit={accountForm.handleSubmit(handleUpdateUserData)}
                  >
                    <FormField
                      control={accountForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={accountForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter your username"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={isLoading}>
                      Update Account
                    </Button>
                  </form>
                </Form>
              </div>
            </TabsContent>

            <TabsContent value="password">
              <div className="space-y-4 py-4">
                <Form {...accountSettingForm}>
                  <form
                    onSubmit={accountSettingForm.handleSubmit(
                      handleUpdatePassword,
                    )}
                    className="space-y-4"
                  >
                    <FormField
                      control={accountSettingForm.control}
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
                      control={accountSettingForm.control}
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
                      control={accountSettingForm.control}
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
