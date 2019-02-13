import { useCallback, useEffect, useRef } from 'react';

export default function useDebouncedCallback(callback, deps, delay) {
  const functionTimeoutHandler = useRef(null);
  const debouncedFunction = useCallback(callback, deps);

  useEffect(
    () => () => {
      clearTimeout(functionTimeoutHandler.current);
    },
    []
  );

  return (...args) => {
    clearTimeout(functionTimeoutHandler.current);
    functionTimeoutHandler.current = setTimeout(() => {
      debouncedFunction(...args);
    }, delay);
  };
}
