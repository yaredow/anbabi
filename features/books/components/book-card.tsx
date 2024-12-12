import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

type BookCardProps = {
  src: string;
  title: string;
};

export default function BookCard({ title, src }: BookCardProps) {
  return (
    <Card className="group w-48 overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
      <CardContent className="p-3">
        <div className="overflow-hidden rounded-md">
          <Image
            src={src}
            alt={title}
            width={180}
            height={270}
            className="h-auto w-full object-cover"
          />
        </div>
        <h3 className="mt-2 truncate text-sm font-medium">{title}</h3>
      </CardContent>
    </Card>
  );
}
