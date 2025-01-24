"use client";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDeleteAccount } from "../api/use-delete-account";
import { useConfirm } from "@/hooks/use-confirm";

export function UserProfileSettingsCard() {
  const { deleteAccount, isPending } = useDeleteAccount();

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
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button>Update Password</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="flex flex-col items-start space-y-4 mt-4">
          <div className="w-full">
            <Button
              variant="destructive"
              className="w-full"
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
