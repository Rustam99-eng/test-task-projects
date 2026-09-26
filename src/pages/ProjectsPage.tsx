import { useCallback, useMemo, useState } from 'react';
import { CreateProjectButton } from '../components/CreateProjectButton';
import { ProjectFormModal } from '../components/ProjectFormModal';
import { ProjectList } from '../components/ProjectList';
import { SearchBar } from '../components/SearchBar';
import { mockProjects } from '../data/mockProjects';
import { useDebounce } from '../hooks/useDebounce';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Project, ProjectFormValues } from '../types/project';

const STORAGE_KEY = 'projects-page:projects';

function createProjectId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `proj-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function ProjectsPage() {
  const [projects, setProjects] = useLocalStorage<Project[]>(
    STORAGE_KEY,
    mockProjects,
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 200);

  const filteredProjects = useMemo(() => {
    const normalized = debouncedQuery.trim().toLowerCase();
    if (!normalized) {
      return projects;
    }

    return projects.filter((project) => {
      const name = project.name.toLowerCase();
      const description = project.description.toLowerCase();
      return name.includes(normalized) || description.includes(normalized);
    });
  }, [projects, debouncedQuery]);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleCreate = useCallback(
    (values: ProjectFormValues) => {
      const nextProject: Project = {
        id: createProjectId(),
        name: values.name,
        description: values.description,
        status: values.status,
        createdAt: new Date().toISOString(),
      };

      setProjects((prev) => [nextProject, ...prev]);
      setIsModalOpen(false);
    },
    [setProjects],
  );

  return (
    <main className="page">
      <header className="page__header">
        <h1 className="page__title">Проекты</h1>
        <p className="page__subtitle">
          Учебный список проектов с поиском и сохранением в localStorage
        </p>
      </header>

      <div className="toolbar">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <CreateProjectButton onClick={openModal} />
      </div>

      <ProjectList
        projects={filteredProjects}
        hasActiveSearch={debouncedQuery.trim().length > 0}
      />

      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleCreate}
      />
    </main>
  );
}
