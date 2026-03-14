import Image from "next/image";
import { Camera } from "lucide-react";

interface DayHeroPlaceholderProps {
  imageUrl?: string;
  city: string;
}

export function DayHeroPlaceholder({ imageUrl, city }: DayHeroPlaceholderProps) {
  if (imageUrl) {
    return (
      <div className="relative aspect-[3/1] w-full overflow-hidden rounded-t-xl">
        <Image
          src={imageUrl}
          alt={city}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 896px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
    );
  }

  return (
    <div className="flex aspect-[3/1] w-full items-center justify-center rounded-t-xl bg-gradient-to-br from-surface-elevated to-muted">
      <div className="flex flex-col items-center gap-1.5 text-subtle">
        <Camera className="h-6 w-6" />
        <span className="text-[11px] font-medium">Photo coming soon</span>
      </div>
    </div>
  );
}
