interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search-bar">
      <label htmlFor="project-search" className="search-bar__label">
        Поиск
      </label>
      <input
        id="project-search"
        className="search-bar__input"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Поиск по названию или описанию…"
        autoComplete="off"
      />
    </div>
  );
}
