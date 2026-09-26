interface CreateProjectButtonProps {
  onClick: () => void;
}

export function CreateProjectButton({ onClick }: CreateProjectButtonProps) {
  return (
    <button type="button" className="create-project-btn" onClick={onClick}>
      Создать проект
    </button>
  );
}
