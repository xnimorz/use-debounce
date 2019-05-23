const React = require('react');
const useDebouncedCallback = require('./callback').default;

export default function useDebounce(value, delay, options = {}) {
  const [state, dispatch] = React.useState(value);
  const [callback, cancel] = useDebouncedCallback(React.useCallback((value) => dispatch(value), []), delay, options);
  const previousValue = React.useRef(value);

  React.useEffect(() => {
    // We need to use this condition otherwise we will run debounce timer for the first render (including maxWait option)
    if (previousValue.current !== value) {
      callback(value);
      previousValue.current = value;
    }
  }, [value, callback]);

  return [state, cancel];
}
