"use client";

import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  progress: number;
  coverUrl: string;
  onRemove?: () => void;
  onOpen?: () => void;
}

export default function BookCard({
  id,
  title,
  progress,
  coverUrl,
  onRemove,
  onOpen,
}: BookCardProps) {
  return (
    <Link href={`/${id}`}>
      <div className="group relative w-[180px] bg-background px-4 py-2 hover:bg-zinc-100 cursor-pointer transition-shadow rounded-lg">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg">
          <Image
            src={coverUrl}
            alt={`Cover of ${title}`}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="p-4 space-y-2">
          <h3 className="font-semibold leading-none text-sm truncate">
            {title}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{progress}%</p>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-full">
                <MoreHorizontal className="size-4 font-semibold" />
                <span className="sr-only">Open menu</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onOpen}>Open</DropdownMenuItem>
                <DropdownMenuItem onClick={onRemove}>Remove</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </Link>
  );
}
