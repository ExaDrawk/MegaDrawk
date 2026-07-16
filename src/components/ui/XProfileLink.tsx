import type { CSSProperties, ReactNode } from "react";
import { ExternalLink } from "lucide-react";

interface XProfileLinkProps {
  readonly href: string;
  readonly label: ReactNode;
  readonly ariaLabel?: string;
  readonly className?: string;
  readonly style?: CSSProperties;
  readonly iconSize?: number;
  readonly target?: "_blank" | "_self";
  readonly rel?: string;
  readonly showExternalIcon?: boolean;
}

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className="shrink-0"
    >
      <path d="M18.901 1.153h3.68l-8.039 9.19L24 22.847h-7.406l-5.8-7.584-6.638 7.584H.474l8.597-9.825L0 1.153h7.594l5.243 6.932 6.064-6.932Zm-1.291 19.492h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

export function XProfileLink({
  href,
  label,
  ariaLabel = "X",
  className,
  style,
  iconSize = 16,
  target = "_blank",
  rel = "noopener noreferrer",
  showExternalIcon = false,
}: XProfileLinkProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={className}
      style={style}
      aria-label={ariaLabel}
    >
      <XIcon size={iconSize} />
      <span>{label}</span>
      {showExternalIcon ? (
        <ExternalLink size={iconSize} aria-hidden="true" className="shrink-0" />
      ) : null}
    </a>
  );
}
