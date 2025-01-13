import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ProjectAvatarProps {
  title: string;
  imageUrl?: string;
  bookId?: string;
}

export function BookAvatar({ title, imageUrl, bookId }: ProjectAvatarProps) {
  const firstLetter = title ? title.charAt(0).toUpperCase() : "";

  return (
    <Link
      href={`/book/${bookId}`}
      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition"
      title={`View book: ${title}`}
    >
      <div
        className={`rounded-md overflow-hidden bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-semibold`}
        aria-hidden="true"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            width={24}
            height={24}
            className="w-full h-full object-cover"
          />
        ) : (
          firstLetter
        )}
      </div>

      <div className="flex flex-col">
        <span className="font-medium text-gray-800 text-sm ">{title}</span>
      </div>
    </Link>
  );
}
