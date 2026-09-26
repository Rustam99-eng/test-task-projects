import type { Project } from '../types/project';
import { ProjectCard } from './ProjectCard';

interface ProjectListProps {
  projects: Project[];
  hasActiveSearch: boolean;
}

export function ProjectList({ projects, hasActiveSearch }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="empty-state" role="status">
        <p className="empty-state__title">
          {hasActiveSearch ? 'Ничего не найдено' : 'Проектов пока нет'}
        </p>
        <p className="empty-state__hint">
          {hasActiveSearch
            ? 'Попробуйте изменить поисковый запрос.'
            : 'Нажмите «Создать проект», чтобы добавить первый.'}
        </p>
      </div>
    );
  }

  return (
    <ul className="project-list">
      {projects.map((project) => (
        <li key={project.id} className="project-list__item">
          <ProjectCard project={project} />
        </li>
      ))}
    </ul>
  );
}
