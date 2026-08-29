import type { CSSProperties } from "react";
import { SITE } from "@/config/site";

const BRAND_LOCKUP_PRESETS = {
  header: {
    iconHeight: 42,
    logoHeight: 58,
    gapClassName: "gap-2.5",
  },
  footer: {
    iconHeight: 24,
    logoHeight: 33,
    gapClassName: "gap-2",
  },
} as const;

interface BrandLockupProps {
  readonly preset: keyof typeof BRAND_LOCKUP_PRESETS;
}

export function BrandLockup({
  preset,
}: BrandLockupProps) {
  const config = BRAND_LOCKUP_PRESETS[preset];
  const iconStyle: CSSProperties = {
    height: `${config.iconHeight}px`,
    width: "auto",
  };
  const logoStyle: CSSProperties = {
    height: `${config.logoHeight}px`,
    width: "auto",
  };

  return (
    <>
      <img
        src="/icon.svg"
        alt=""
        width={42}
        height={42}
        className="object-contain shrink-0"
        style={iconStyle}
        aria-hidden="true"
        loading="eager"
      />
      <img
        src="/logo.svg"
        alt={SITE.name}
        width={241}
        height={77}
        className="object-contain shrink-0"
        style={logoStyle}
      />
    </>
  );
}

export function getBrandLockupContainerClassName(
  preset: keyof typeof BRAND_LOCKUP_PRESETS,
): string {
  return `inline-flex items-center ${BRAND_LOCKUP_PRESETS[preset].gapClassName}`;
}
