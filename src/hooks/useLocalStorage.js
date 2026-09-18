import { useState, useCallback, useEffect } from "react";

/**
 * Persist a piece of state to localStorage and keep it in sync across tabs.
 */
export const useLocalStorage = (key, initialValue) => {
  const read = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  };

  const [stored, setStored] = useState(read);

  const set = useCallback(
    (value) => {
      setStored((prev) => {
        const next = typeof value === "function" ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [key]
  );

  useEffect(() => {
    const handler = (e) => {
      if (e.key === key && e.newValue != null) {
        try {
          setStored(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key]);

  return [stored, set];
};
