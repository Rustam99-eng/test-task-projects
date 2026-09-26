import { useEffect, useState } from 'react';

/**
 * Синхронизирует состояние с localStorage.
 * При ошибках чтения/записи (квота, битый JSON) возвращает initialValue
 * и не роняет приложение.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) {
        window.localStorage.setItem(key, JSON.stringify(initialValue));
        return initialValue;
      }
      return JSON.parse(raw) as T;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // Квота localStorage исчерпана — оставляем данные в памяти сессии.
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
