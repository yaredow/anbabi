import { LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { signOut, useSession } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useOpenProfileModal } from "../hooks/use-open-profile-modal";

const recentBooks = [
  {
    id: 1,
    title: "The Great Gatsby",
    cover: "/placeholder.svg?height=80&width=60",
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    cover: "/placeholder.svg?height=80&width=60",
  },
  { id: 3, title: "1984", cover: "/placeholder.svg?height=80&width=60" },
];

export default function UserProfileCard() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const { open } = useOpenProfileModal();

  const handleLogout = () => {
    signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="relative p-2">
          <Image
            src={user?.image || "/images/placeholder.webp"}
            alt={user?.name || ""}
            width={96}
            height={96}
            className="rounded-full"
          />
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-4 w-4 text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </label>
          <Input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
          />
        </div>
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
          {/* <EditNameDialog
              initialName={userName}
              onSave={(newName) => {
                console.log("New name:", newName);
                setUserName(newName);
              }}
            /> */}
        </div>
        <p className="text-gray-600">{user?.email}</p>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Recently Read
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {recentBooks.map((book) => (
            <Link key={book.id} href={`/books/${book.id}`} className="group">
              <div className="aspect-w-2 aspect-h-3 w-full overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={book.cover || "/placeholder.svg"}
                  alt={book.title}
                  width={60}
                  height={80}
                  className="object-cover object-center group-hover:opacity-75"
                />
              </div>
              <p className="mt-1 text-xs text-gray-700 truncate">
                {book.title}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" className="mr-2" onClick={open}>
          <Settings className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
        <Button
          variant="ghost"
          className="text-red-600 hover:text-red-800 hover:bg-red-100"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
