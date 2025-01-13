import { cn, generatePastelColor, getInitials } from "@/lib/utils";
import Image from "next/image";

interface CollectionAvatarProps {
  name: string;
  image?: string;
  className?: string;
  description?: string;
}

export function CollectionAvatar({
  name,
  description,
  image,
  className,
}: CollectionAvatarProps) {
  const pastelColor = generatePastelColor(name);

  return (
    <div className={cn("flex items-center space-x-2 w-full", className)}>
      <div
        className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: image ? "transparent" : pastelColor }}
      >
        {image ? (
          <Image
            src={image}
            alt={name}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <span className="text-xs font-semibold text-primary-foreground">
            {getInitials(name)}
          </span>
        )}
      </div>
      <div className="flex-grow min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{name}</p>
        {description && (
          <p className="text-xs text-muted-foreground truncate">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
