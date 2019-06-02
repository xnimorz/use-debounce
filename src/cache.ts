import { useState, useCallback, useRef, useEffect } from 'react';
import useDebouncedCallback from './callback';

export default function useDebounce<T>(value: T, delay: number, options?: { maxWait?: number }): [T, () => void] {
  const [state, dispatch] = useState(value);
  const [callback, cancel] = useDebouncedCallback(useCallback((value) => dispatch(value), []), delay, options);
  const previousValue = useRef(value);

  useEffect(() => {
    // We need to use this condition otherwise we will run debounce timer for the first render (including maxWait option)
    if (previousValue.current !== value) {
      callback(value);
      previousValue.current = value;
    }
  }, [value, callback]);

  return [state, cancel];
}
