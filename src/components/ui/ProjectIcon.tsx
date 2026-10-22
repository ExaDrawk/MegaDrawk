interface ProjectIconProps {
  readonly src: string;
  readonly alt: string;
  readonly href: string;
  readonly size?: "sm" | "md";
}

export function ProjectIcon({ src, alt, href, size = "md" }: ProjectIconProps) {
  const dimension = size === "sm" ? 56 : 64;
  const className = size === "sm" ? "w-14 h-14" : "w-16 h-16";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative block shrink-0 rounded-lg overflow-hidden border border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)] hover:border-[var(--color-accent)] transition-all hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] ${className}`}
      aria-label={`${alt}（アプリアイコン）`}
    >
      <img
        src={src}
        alt=""
        width={dimension}
        height={dimension}
        className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-90"
        aria-hidden="true"
      />
    </a>
  );
}
