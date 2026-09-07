import Image from "next/image";
import { SITE } from "@/config/site";

const BRAND_LOCKUP_PRESETS = {
  header: {
    iconWidth: 42,
    iconHeight: 42,
    logoWidth: 241,
    logoHeight: 77,
    iconClassName: "h-[42px] w-auto",
    logoClassName: "h-[58px] w-auto",
    gapClassName: "gap-2.5",
  },
  footer: {
    iconWidth: 42,
    iconHeight: 42,
    logoWidth: 241,
    logoHeight: 77,
    iconClassName: "h-[24px] w-auto",
    logoClassName: "h-[33px] w-auto",
    gapClassName: "gap-2",
  },
  hero: {
    iconWidth: 72,
    iconHeight: 72,
    logoWidth: 241,
    logoHeight: 77,
    iconClassName: "h-11 sm:h-16 md:h-[72px] w-auto",
    logoClassName: "h-14 sm:h-20 md:h-[92px] w-auto",
    gapClassName: "gap-3 sm:gap-4 md:gap-5",
  },
} as const;

export type BrandLockupPreset = keyof typeof BRAND_LOCKUP_PRESETS;

interface BrandLockupProps {
  readonly priority?: boolean;
  readonly preset: BrandLockupPreset;
  readonly hideAlt?: boolean;
}

export function BrandLockup({
  preset,
  priority = false,
  hideAlt = false,
}: BrandLockupProps) {
  const config = BRAND_LOCKUP_PRESETS[preset];

  return (
    <>
      <Image
        src="/icon.svg"
        alt=""
        width={config.iconWidth}
        height={config.iconHeight}
        className={`object-contain shrink-0 ${config.iconClassName}`}
        aria-hidden="true"
      />
      <Image
        src="/logo.svg"
        alt={hideAlt ? "" : SITE.name}
        width={config.logoWidth}
        height={config.logoHeight}
        className={`object-contain shrink-0 ${config.logoClassName}`}
        priority={priority}
        aria-hidden={hideAlt ? true : undefined}
      />
    </>
  );
}

export function getBrandLockupContainerClassName(
  preset: BrandLockupPreset,
): string {
  return `inline-flex items-center ${BRAND_LOCKUP_PRESETS[preset].gapClassName}`;
}

