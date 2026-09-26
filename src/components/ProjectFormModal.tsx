import { useEffect, useId, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import type { ProjectFormValues, ProjectStatus } from '../types/project';
import { PROJECT_STATUS_LABELS, PROJECT_STATUSES } from '../types/project';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ProjectFormValues) => void;
}

interface FormErrors {
  name?: string;
  description?: string;
}

const INITIAL_VALUES: ProjectFormValues = {
  name: '',
  description: '',
  status: 'new',
};

function validate(values: ProjectFormValues): FormErrors {
  const errors: FormErrors = {};
  const trimmedName = values.name.trim();

  if (!trimmedName) {
    errors.name = 'Название обязательно';
  } else if (trimmedName.length < 3) {
    errors.name = 'Минимум 3 символа';
  } else if (trimmedName.length > 60) {
    errors.name = 'Максимум 60 символов';
  }

  if (values.description.length > 300) {
    errors.description = 'Максимум 300 символов';
  }

  return errors;
}

export function ProjectFormModal({
  isOpen,
  onClose,
  onSubmit,
}: ProjectFormModalProps) {
  const titleId = useId();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<ProjectFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ name?: boolean; description?: boolean }>(
    {},
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setValues(INITIAL_VALUES);
    setErrors({});
    setTouched({});

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      nameInputRef.current?.focus();
    }, 0);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setTouched({ name: true, description: true });

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit({
      name: values.name.trim(),
      description: values.description.trim(),
      status: values.status,
    });
  };

  const handleBackdropClick = () => {
    onClose();
  };

  const handleDialogKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  const showNameError = Boolean(touched.name && errors.name);
  const showDescriptionError = Boolean(touched.description && errors.description);

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={handleDialogKeyDown}
      >
        <div className="modal__header">
          <h2 id={titleId} className="modal__title">
            Новый проект
          </h2>
          <button
            type="button"
            className="modal__close"
            onClick={onClose}
            aria-label="Закрыть форму"
          >
            ×
          </button>
        </div>

        <form className="project-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="project-name">Название</label>
            <input
              ref={nameInputRef}
              id="project-name"
              type="text"
              value={values.name}
              maxLength={60}
              aria-invalid={showNameError}
              aria-describedby={showNameError ? 'project-name-error' : undefined}
              onChange={(event) => {
                const name = event.target.value;
                setValues((prev) => ({ ...prev, name }));
                if (touched.name) {
                  setErrors(validate({ ...values, name }));
                }
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, name: true }));
                setErrors(validate(values));
              }}
            />
            {showNameError ? (
              <p id="project-name-error" className="form-field__error" role="alert">
                {errors.name}
              </p>
            ) : null}
          </div>

          <div className="form-field">
            <label htmlFor="project-description">
              Описание
              <span className="form-field__hint">
                {' '}
                ({values.description.length}/300)
              </span>
            </label>
            <textarea
              id="project-description"
              value={values.description}
              maxLength={300}
              rows={4}
              aria-invalid={showDescriptionError}
              aria-describedby={
                showDescriptionError ? 'project-description-error' : undefined
              }
              onChange={(event) => {
                const description = event.target.value;
                setValues((prev) => ({ ...prev, description }));
                if (touched.description) {
                  setErrors(validate({ ...values, description }));
                }
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, description: true }));
                setErrors(validate(values));
              }}
            />
            {showDescriptionError ? (
              <p
                id="project-description-error"
                className="form-field__error"
                role="alert"
              >
                {errors.description}
              </p>
            ) : null}
          </div>

          <div className="form-field">
            <label htmlFor="project-status">Статус</label>
            <select
              id="project-status"
              value={values.status}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  status: event.target.value as ProjectStatus,
                }))
              }
            >
              {PROJECT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {PROJECT_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>

          <div className="project-form__actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn--primary">
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
