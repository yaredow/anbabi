"use client";

import Image from "next/image";
import Link from "next/link";

interface BookCardProps {
	id: string;
	bookUrl: string;
	title: string;
	progress: number;
	onRemove?: () => void;
}

export default function BookCard({
	bookUrl,
	id,
	progress,
	title,
}: BookCardProps) {
	return (
		<div className="group relative w-[180px] bg-background px-4 py-2 cursor-pointer transition-shadow rounded-lg">
			<Link href={`/books/${id}`}>
				<div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg hover:scale-105">
					<Image
						src={bookUrl}
						alt={`Cover of ${title}`}
						fill
						className="object-cover"
						priority
					/>
				</div>
			</Link>

			<div className="flex justify-between items-center p-4 space-x-2">
				<h3 className="font-semibold leading-none text-sm truncate">{title}</h3>
				<p className="text-xs text-muted-foreground">{progress}%</p>
			</div>
		</div>
	);
}
