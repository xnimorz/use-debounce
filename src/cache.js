import { useState, useEffect, useRef, useCallback } from 'react';

export default function useDebounce(value, delay) {
  const functionTimeoutHandler = useRef(null);
  const [debouncedValue, setDebouncedValue] = useState(value);
  const cancelDebouncedValue = useCallback(() => {
    clearTimeout(functionTimeoutHandler.current);
  }, [functionTimeoutHandler.current]);

  useEffect(() => {
    functionTimeoutHandler.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => cancelDebouncedValue();
  }, [value, delay]);

  return [debouncedValue, cancelDebouncedValue];
}
