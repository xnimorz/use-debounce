import { useState, useEffect, useRef, useCallback } from 'react';

import useDebouncedCallback from './callback';

export default function useDebounce(value, delay, options = {}) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [debouncedCallback, cancel] = useDebouncedCallback(
    (value) => setDebouncedValue(value),
    delay,
    [value],
    options
  );

  useEffect(() => {
    if (debouncedValue !== value) {
      debouncedCallback(value);
    }
  });

  return [debouncedValue, cancel];
}
