import { useState, useCallback, useRef, useEffect } from 'react';
import useDebouncedCallback from './useDebouncedCallback';

function refEquality<T>(left: T, right: T): boolean {
  return left === right;
}

export default function useDebounce<T>(
  value: T,
  delay: number,
  options?: { maxWait?: number; leading?: boolean },
  equalityFn: (left: T, right: T) => boolean = refEquality
): [T, () => void] {
  const [state, dispatch] = useState(value);
  const [callback, cancel] = useDebouncedCallback(useCallback((value) => dispatch(value), []), delay, options);
  const previousValue = useRef(value);

  useEffect(() => {
    // We need to use this condition otherwise we will run debounce timer for the first render (including maxWait option)
    if (!equalityFn(previousValue.current, value)) {
      callback(value);
      previousValue.current = value;
    }
  }, [value, callback, equalityFn]);

  return [state, cancel];
}
