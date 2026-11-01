import { PROJECTS } from "@/config/projects";

const PLAY_BADGE = "/images/google-play-badge-ja.png";

/**
 * ストア掲載の導線。Google Playのアプリは公式バッジ、
 * それ以外はストア名のテキストリンクだけを表示する。
 */
export function ProjectList() {
  return (
    <div className="play-badge-list">
      {PROJECTS.map((project) => {
        if (project.href.includes("play.google.com")) {
          return (
            <div className="play-badge-item" key={project.href}>
              <a
                className="play-badge"
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.name} を Google Play で開く`}
              >
                <img
                  src={PLAY_BADGE}
                  alt="Google Play で手に入れよう"
                  width={646}
                  height={250}
                  loading="lazy"
                  decoding="async"
                />
              </a>
              <p className="play-badge__name">{project.name}</p>
            </div>
          );
        }
        return (
          <a
            className="store-text-link"
            key={project.href}
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {project.name}（Chrome ウェブストア）
          </a>
        );
      })}
    </div>
  );
}
