import { useRef, useCallback, useEffect } from 'react';

export default function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  options: { maxWait?: number; leading?: boolean } = {}
): [T, () => void, () => void] {
  const maxWait = options.maxWait;
  const maxWaitHandler = useRef(null);
  const maxWaitArgs: { current: any[] } = useRef([]);

  const leading = options.leading;
  const wasLeadingCalled: { current: boolean } = useRef(false);

  const functionTimeoutHandler = useRef(null);
  const isComponentUnmounted: { current: boolean } = useRef(false);

  const debouncedFunction = callback;

  const cancelDebouncedCallback: () => void = useCallback(() => {
    clearTimeout(functionTimeoutHandler.current);
    clearTimeout(maxWaitHandler.current);
    maxWaitHandler.current = null;
    maxWaitArgs.current = [];
    functionTimeoutHandler.current = null;
    wasLeadingCalled.current = false;
  }, []);

  useEffect(
    () => () => {
      // we use flag, as we allow to call callPending outside the hook
      isComponentUnmounted.current = true;
    },
    []
  );

  const debouncedCallback = useCallback(
    (...args) => {
      maxWaitArgs.current = args;
      clearTimeout(functionTimeoutHandler.current);

      if (!functionTimeoutHandler.current && leading && !wasLeadingCalled.current) {
        debouncedFunction(...args);
        wasLeadingCalled.current = true;
        return;
      }

      functionTimeoutHandler.current = setTimeout(() => {
        cancelDebouncedCallback();

        if (!isComponentUnmounted.current) {
          debouncedFunction(...args);
        }
      }, delay);

      if (maxWait && !maxWaitHandler.current) {
        maxWaitHandler.current = setTimeout(() => {
          const args = maxWaitArgs.current;
          cancelDebouncedCallback();

          if (!isComponentUnmounted.current) {
            debouncedFunction.apply(null, args);
          }
        }, maxWait);
      }
    },
    [debouncedFunction, maxWait, delay, cancelDebouncedCallback, leading]
  );

  const callPending = () => {
    // Call pending callback only if we have anything in our queue
    if (!functionTimeoutHandler.current) {
      return;
    }

    debouncedFunction.apply(null, maxWaitArgs.current);
    cancelDebouncedCallback();
  };

  // At the moment, we use 3 args array so that we save backward compatibility
  return [debouncedCallback as T, cancelDebouncedCallback, callPending];
}
