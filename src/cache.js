const React = require('react');
const useDebouncedCallback = require('./callback').default;

export default function useDebounce(value, delay, options = {}) {
  const debouncedState = React.useState(value);
  const debouncedCallback = useDebouncedCallback((value) => debouncedState[1](value), delay, options);

  React.useEffect(() => {
    if (debouncedState[0] !== value) {
      debouncedCallback[0](value);
    }
  });

  return [debouncedState[0], debouncedCallback[1]];
}
