import type { Project } from '../types/project';
import { PROJECT_STATUS_LABELS } from '../types/project';

interface ProjectCardProps {
  project: Project;
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="project-card">
      <header className="project-card__header">
        <h2 className="project-card__title">{project.name}</h2>
        <span
          className={`project-card__status project-card__status--${project.status}`}
        >
          {PROJECT_STATUS_LABELS[project.status]}
        </span>
      </header>
      <p className="project-card__description">
        {project.description || 'Без описания'}
      </p>
      <time className="project-card__date" dateTime={project.createdAt}>
        Создан: {formatDate(project.createdAt)}
      </time>
    </article>
  );
}
