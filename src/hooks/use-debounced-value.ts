import { useEffect, useState } from "react";

/**
 * Returns a debounced version of the provided value.
 * Useful for delaying expensive work (e.g. filtering large lists)
 * until the user stops typing.
 */
export const useDebouncedValue = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
