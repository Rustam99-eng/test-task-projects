export type ProjectStatus = 'new' | 'in_progress' | 'done';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  createdAt: string;
}

export interface ProjectFormValues {
  name: string;
  description: string;
  status: ProjectStatus;
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  new: 'Новый',
  in_progress: 'В работе',
  done: 'Готово',
};

export const PROJECT_STATUSES: ProjectStatus[] = ['new', 'in_progress', 'done'];
