import Image from "next/image";

interface Props {
  destination: string;
  backgroundUrl: string;
}

export function PlanDestinationHero({ destination, backgroundUrl }: Props) {
  return (
    <div className="absolute inset-0 h-[360px] overflow-hidden">
      <Image
        src={backgroundUrl}
        alt={`Scenic view of ${destination}`}
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
    </div>
  );
}
