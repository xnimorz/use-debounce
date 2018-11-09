import { useState, useEffect } from "react";

export const useDebounce = (value, timeout) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [handler, setHandler] = useState({});
  useEffect(() => {
    if (handler.value !== value) {
      clearTimeout(handler.handler);
      setHandler({
        handler: setTimeout(() => {
          setDebouncedValue(value);
        }, timeout),
        value
      });
    }
  });

  return debouncedValue;
};
