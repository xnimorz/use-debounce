import { useCallback, useEffect, useRef, useState } from 'react';
import useDebouncedCallback from './useDebouncedCallback';

function valueEquality<T>(left: T, right: T): boolean {
  return left === right;
}

export default function useDebounce<T>(
  value: T,
  delay: number,
  options?: { maxWait?: number; leading?: boolean; trailing?: boolean; equalityFn?: (left: T, right: T) => boolean }
): [T, () => void, () => void] {
  const eq = options && options.equalityFn ? options.equalityFn : valueEquality;

  const [state, dispatch] = useState(value);
  const [callback, cancel, callPending] = useDebouncedCallback(
    useCallback((value: T) => dispatch(value), []),
    delay,
    options
  );
  const previousValue = useRef(value);

  useEffect(() => {
    // We need to use this condition otherwise we will run debounce timer for the first render (including maxWait option)
    if (!eq(previousValue.current, value)) {
      callback(value);
      previousValue.current = value;
    }
  }, [value, callback, eq]);

  return [state, cancel, callPending];
}
