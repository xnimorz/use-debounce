const React = require('react');
const useDebouncedCallback = require('./callback').default;

export default function useDebounce(value, delay, options = {}) {
  const [state, dispatch] = React.useState(value);
  const [callback, cancel] = useDebouncedCallback(React.useCallback((value) => dispatch(value), []), delay, options);

  React.useEffect(() => {
    if (state !== value) {
      callback(value);
    }
  }, [value, state, callback]);

  return [state, cancel];
}
