import { PROJECTS } from "@/config/projects";

/**
 * 公開アプリの索引。Google Playのアプリは、ストアのアイコン・説明・
 * スクリーンショットを直接参照し、バッジではなく本文と同じ組版で見せる。
 */
export function ProjectList() {
  return (
    <div className="app-list">
      {PROJECTS.map((project) => (
        <article
          className={
            "app-list__item" +
            (project.screenshotUrl ? "" : " app-list__item--text")
          }
          key={project.href}
        >
          <div className="app-list__content">
            <div className="app-list__identity">
              <img
                className="app-list__icon"
                src={project.iconUrl}
                alt=""
                width={56}
                height={56}
                decoding="async"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="app-list__eyebrow">{project.platform}</p>
                <h3 className="app-list__name">{project.name}</h3>
              </div>
            </div>
            <p className="app-list__description">{project.description}</p>
            <a
              className="app-list__link"
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.name}を${project.linkLabel}で見る`}
            >
              {project.linkLabel}で見る
              <span aria-hidden="true"> ↗</span>
            </a>
          </div>
          {project.screenshotUrl ? (
            <img
              className="app-list__shot"
              src={project.screenshotUrl}
              alt={`${project.name}のスクリーンショット`}
              width={526}
              height={296}
              decoding="async"
              referrerPolicy="no-referrer"
            />
          ) : null}
        </article>
      ))}
    </div>
  );
}
