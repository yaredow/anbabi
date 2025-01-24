"use client";

import { useOpenProfileModal } from "../hooks/use-open-profile-modal";
import ResponsiveProfileModal from "./responsive-profile-modal";
import UserProfileCard from "./user-profile-card";

export default function UserProfileModal() {
  const { isOpen, setIsOpen } = useOpenProfileModal();

  return (
    <ResponsiveProfileModal open={isOpen} onOpenChange={setIsOpen}>
      <UserProfileCard />
    </ResponsiveProfileModal>
  );
}
