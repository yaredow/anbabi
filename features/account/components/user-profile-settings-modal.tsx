"use client";

import { useOpeUserProfileSettingsModal } from "../hooks/use-open-profile-settings-modal";
import { UserProfileSettingsCard } from "./user-profile-setting-card";
import ResponsiveProfileModal from "./responsive-profile-modal";

export default function UserProfileSettingsModal() {
  const { isOpen, setIsOpen, close } = useOpeUserProfileSettingsModal();

  return (
    <ResponsiveProfileModal open={isOpen} onOpenChange={setIsOpen}>
      <UserProfileSettingsCard onClose={close} />
    </ResponsiveProfileModal>
  );
}
