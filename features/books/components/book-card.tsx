import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useGetBookInformation } from "../api/use-get-book-information";

interface BookCardProps {
  coverImage: string;
  title: string;
}

export default function BookCard({ title, coverImage }: BookCardProps) {
  return (
    <Card className="group w-48 overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
      <CardContent className="p-3">
        <div className="relative aspect-square overflow-hidden rounded-md">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <h3 className="mt-2 truncate text-sm font-medium">{title}</h3>
      </CardContent>
    </Card>
  );
}
