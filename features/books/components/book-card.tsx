"use client";

import Image from "next/image";
import Link from "next/link";

import BookActionsDropdownMenu from "./book-actions-dropdown-menu";
import { useCategoryName } from "../hooks/use-category-name";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  progress: number;
  coverUrl: string;
  onRemove?: () => void;
}

export default function BookCard({
  id,
  title,
  progress,
  coverUrl,
}: BookCardProps) {
  const categoryName = useCategoryName();

  return (
    <div className="group relative w-[180px] bg-background px-4 py-2 cursor-pointer transition-shadow rounded-lg">
      <Link href={`/category/${categoryName}/book/${id}`}>
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg hover:scale-105">
          <Image
            src={coverUrl}
            alt={`Cover of ${title}`}
            fill
            className="object-cover"
            priority
          />
        </div>
      </Link>

      <div className="p-4 space-y-2">
        <h3 className="font-semibold leading-none text-sm truncate">{title}</h3>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{progress}%</p>
          <BookActionsDropdownMenu />
        </div>
      </div>
    </div>
  );
}
