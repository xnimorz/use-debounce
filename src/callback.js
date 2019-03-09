import { useCallback, useEffect, useRef } from 'react';

export default function useDebouncedCallback(callback, delay, deps, options = {}) {
  const { maxWait } = options;
  const maxWaitHandler = useRef(null);
  const maxWaitArgs = useRef([]);
  const functionTimeoutHandler = useRef(null);
  const isComponentUnmounted = useRef(false);

  const debouncedFunction = useCallback(callback, deps);

  const cancelDebouncedCallback = useCallback(() => {
    clearTimeout(functionTimeoutHandler.current);
    clearTimeout(maxWaitHandler.current);
    maxWaitHandler.current = null;
    maxWaitArgs.current = [];
    functionTimeoutHandler.current = null;
  }, [functionTimeoutHandler.current, maxWaitHandler.current]);

  useEffect(
    () => () => {
      // we use flag, as we allow to call callPending outside the hook
      isComponentUnmounted.current = true;
    },
    []
  );

  const debouncedCallback = (...args) => {
    maxWaitArgs.current = args;
    clearTimeout(functionTimeoutHandler.current);
    functionTimeoutHandler.current = setTimeout(() => {
      if (!isComponentUnmounted.current) {
        debouncedFunction(...args);
      }

      cancelDebouncedCallback();
    }, delay);

    if (maxWait && !maxWaitHandler.current) {
      maxWaitHandler.current = setTimeout(() => {
        if (!isComponentUnmounted.current) {
          debouncedFunction(...maxWaitArgs.current);
        }
        cancelDebouncedCallback();
      }, maxWait);
    }
  };

  const callPending = () => {
    // Call pending callback only if we have anything in our queue
    if (!functionTimeoutHandler.current) {
      return;
    }

    debouncedFunction(...maxWaitArgs.current);
    cancelDebouncedCallback();
  };

  // For the moment, we use 3 args array so that we save backward compatibility
  return [debouncedCallback, cancelDebouncedCallback, callPending];
}
