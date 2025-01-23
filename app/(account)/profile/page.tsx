"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Settings } from "lucide-react";
import { EditNameDialog } from "@/features/auth/components/edit-name-dialog";

// This would typically come from your authentication system
const user = {
  name: "Jane Doe",
  email: "jane@example.com",
  avatar: "/placeholder.svg?height=128&width=128",
};

// This would typically come from your database
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
  {
    id: 4,
    title: "Pride and Prejudice",
    cover: "/placeholder.svg?height=80&width=60",
  },
];

export default function ProfilePage() {
  const [userName, setUserName] = useState(user.name);

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" className="mr-4" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/profile/settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <Image
                src={user.avatar || "/images/placeholder.webp"}
                alt={userName}
                width={128}
                height={128}
                className="rounded-full"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-5 w-5 text-gray-600"
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
            <div className="flex items-center justify-center">
              <h2 className="text-2xl font-semibold text-gray-900">
                {userName}
              </h2>
              <EditNameDialog
                initialName={userName}
                onSave={(newName) => {
                  // Here you would typically update the name in your backend
                  console.log("New name:", newName);
                  setUserName(newName);
                }}
              />
            </div>
            <p className="text-gray-600">{user.email}</p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Recently Accessed Books
            </h3>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-6">
              {recentBooks.map((book) => (
                <Link
                  key={book.id}
                  href={`/books/${book.id}`}
                  className="group"
                >
                  <div className="aspect-w-2 aspect-h-3 w-full overflow-hidden rounded-lg bg-gray-100 shadow-md transition-shadow duration-300 ease-in-out group-hover:shadow-lg">
                    <Image
                      src={book.cover || "/placeholder.svg"}
                      alt={book.title}
                      width={60}
                      height={80}
                      className="object-cover object-center group-hover:opacity-75 transition-opacity duration-300 ease-in-out"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-300 ease-in-out">
                    {book.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <Button variant="outline" className="w-full max-w-xs">
              Log Out
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
