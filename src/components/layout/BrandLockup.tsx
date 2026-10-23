import { SITE } from "@/config/site";

export function BrandLockup() {
  return (
    <span className="brand-lockup">
      <img
        className="brand-icon"
        src="/icon.svg"
        alt=""
        width="48"
        height="48"
      />
      <img
        className="brand-wordmark"
        src="/logo.svg"
        alt={SITE.name}
        width="241"
        height="77"
      />
    </span>
  );
}
