import { useState, useEffect } from 'react';

/**
 * A simple hook wrapping localStorage with JSON serialization.
 * It falls back to useState only when localStorage is not available.
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const read = (): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initial;
    } catch {
      return initial;
    }
  };

  const [value, setValue] = useState<T>(read);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // no-op for environments without storage
    }
  }, [key, value]);

  return [value, setValue] as const;
}
