import { useCallback, useEffect, useRef } from 'react';

export default function useDebouncedCallback(callback, delay, deps) {
  const functionTimeoutHandler = useRef(null);
  const debouncedFunction = useCallback(callback, deps);
  const cancel = useCallback(() => {
    clearTimeout(functionTimeoutHandler.current);
  }, [functionTimeoutHandler.current]);

  useEffect(
    () => () => {
      cancel();
    },
    []
  );

  const debouncedCallback = (...args) => {
    clearTimeout(functionTimeoutHandler.current);
    functionTimeoutHandler.current = setTimeout(() => {
      debouncedFunction(...args);
    }, delay);
  };

  debouncedCallback.cancel = cancel;

  return debouncedCallback;
}
