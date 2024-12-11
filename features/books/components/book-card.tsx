import Image from "next/image";

interface BookCardProps {
  src: string;
  title: string;
}

export function BookCard({ src, title }: BookCardProps) {
  return (
    <div className="relative aspect-[2/3] w-full rounded-md shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
      <Image
        src={src}
        alt={title}
        width={140}
        height={210}
        className="rounded-md object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 text-sm text-white opacity-0 transition-opacity duration-300 hover:opacity-100">
        {title}
      </div>
    </div>
  );
}
