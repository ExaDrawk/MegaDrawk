import { PROJECTS } from "@/config/projects";
import { ProjectIcon } from "./ProjectIcon";
export function ProjectList() {
  return (
    <div className="project-list">
      {PROJECTS.map((project) => (
        <article className="project" key={project.href}>
          <ProjectIcon
            src={project.imageSrc}
            alt={project.name}
            href={project.href}
          />
          <div className="project__copy">
            <p className="project__platform">{project.platform}</p>
            <h3>
              <a href={project.href} target="_blank" rel="noopener noreferrer">
                {project.name}
              </a>
            </h3>
            <p>{project.description}</p>
            <a
              className="project__store"
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {project.linkLabel}
              <span aria-hidden="true"> ↗</span>
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
