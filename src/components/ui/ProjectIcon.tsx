interface ProjectIconProps {
  readonly src: string;
  readonly alt: string;
  readonly href: string;
}
export function ProjectIcon({ src, alt, href }: ProjectIconProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="project__icon"
      aria-label={alt + "（アプリアイコン）"}
    >
      <img
        src={src}
        alt=""
        width={64}
        height={64}
        loading="lazy"
        decoding="async"
      />
    </a>
  );
}
