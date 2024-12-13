import Image from "next/image";

type BookCardProps = {
  src: string;
  title: string;
};

export default function BookCard({ src, title }: BookCardProps) {
  return (
    <div className="group relative h-60 w-44 overflow-hidden rounded-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
      <Image
        src={src}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}
