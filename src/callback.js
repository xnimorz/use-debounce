import { useCallback, useEffect, useRef } from 'react';

export default function useDebouncedCallback(callback, delay, deps, options = {}) {
  const { maxWait } = options;
  const maxWaitHandler = useRef(null);
  const maxWaitArgs = useRef([]);
  const functionTimeoutHandler = useRef(null);

  const debouncedFunction = useCallback(callback, deps);

  const cancelDebouncedCallback = useCallback(() => {
    clearTimeout(functionTimeoutHandler.current);
    clearTimeout(maxWaitHandler.current);
    maxWaitHandler.current = null;
    maxWaitArgs.current = [];
  }, [functionTimeoutHandler.current, maxWaitHandler.current]);

  useEffect(
    () => () => {
      cancelDebouncedCallback();
    },
    []
  );

  const debouncedCallback = (...args) => {
    maxWaitArgs.current = args;
    clearTimeout(functionTimeoutHandler.current);
    functionTimeoutHandler.current = setTimeout(() => {
      debouncedFunction(...args);

      cancelDebouncedCallback();
    }, delay);

    if (maxWait && !maxWaitHandler.current) {
      maxWaitHandler.current = setTimeout(() => {
        debouncedFunction(...maxWaitArgs.current);
        cancelDebouncedCallback();
      }, maxWait);
    }
  };

  return [debouncedCallback, cancelDebouncedCallback];
}
