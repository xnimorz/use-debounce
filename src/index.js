import { useState, useEffect, useRef } from 'react';

export const useDebounce = (value, timeout) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const handler = useRef();

  useEffect(
    () => {
      clearTimeout(handler.current);
      handler.current = setTimeout(() => {
        setDebouncedValue(value);
      }, timeout);

      return () => {
        clearTimeout(handler.current);
      };
    },
    [value]
  );

  return debouncedValue;
};
