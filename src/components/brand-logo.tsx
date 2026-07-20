import Image from "next/image";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center ${className ?? ""}`}>
      <Image
        src="/logo-color.png"
        alt="CoolArena"
        width={1200}
        height={450}
        priority
        className="block h-full w-auto dark:hidden"
      />
      <Image
        src="/logo-white.png"
        alt="CoolArena"
        width={1200}
        height={450}
        priority
        className="hidden h-full w-auto dark:block"
      />
    </span>
  );
}
