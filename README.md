# useDebounce react hook

Install it with yarn:

```
yarn add use-debounce
```

Or with npm:

```
npm i use-debounce --save
```

## Demos

The simplest way to start playing around with use-debounce is with this CodeSandbox snippet:
https://codesandbox.io/s/kx75xzyrq7

More complex example with searching for matching countries using debounced input: https://codesandbox.io/s/rr40wnropq (thanks to https://twitter.com/ZephDavies)

## Simple debouncing

According to https://twitter.com/dan_abramov/status/1060729512227467264

```javascript
import React, { useState } from 'react';
import { useDebounce } from 'use-debounce';

export default function Input() {
  const [text, setText] = useState('Hello');
  const debouncedText = useDebounce(text, 1000);

  return (
    <div>
      <input
        defaultValue={'Hello'}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
      <p>Actual value: {text}</p>
      <p>Debounce value: {debouncedText}</p>
    </div>
  );
}
```

## Debounced callbacks

Besides `useDebounce` for values you can debounce callbacks, that is the more commonly understood kind of debouncing.
Example with Input (and react callbacks): https://codesandbox.io/s/x0jvqrwyq

```js
  import useDebouncedCallback from 'use-debounce/callback';
  
  function Input({ defaultValue }) {
  const [value, setValue] = useState(defaultValue);
  // Debounce callback
  const debouncedFunction = useDebounce(
    // function
    value => {
      setValue(value);
    },
    // delay in ms
    1000,
    // deps (in case your function has closure dependency like https://reactjs.org/docs/hooks-reference.html#usecallback)
    [],
  );

  // you should use `e => debouncedFunction(e.target.value)` as react works with synthetic evens
  return (
    <div>
      <input
        defaultValue={defaultValue}
        onChange={e => debouncedFunction(e.target.value)}
      />
      <p>Debounced value: {value}</p>
    </div>
  );
}
```

Example with Scroll (and native event listeners): https://codesandbox.io/s/32yqlyo815

```js
function ScrolledComponent() {
  // just a counter to show, that there are no any unnessesary updates
  const updatedCount = useRef(0);
  updatedCount.current++;

  const [position, setPosition] = useState(window.pageYOffset);

  // Debounce callback
  const scrollHandler = useDebouncedCallback(
    // function
    () => {
      setPosition(window.pageYOffset);
    },
    // delay in ms
    800,
    // deps (in case your function has closure dependency like https://reactjs.org/docs/hooks-reference.html#usecallback)
    []
  );

  useEffect(() => {
    const unsubscribe = subscribe(window, 'scroll', scrollHandler);
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div style={{ height: 10000 }}>
      <div style={{ position: 'fixed', top: 0, left: 0 }}>
        <p>Debounced top position: {position}</p>
        <p>Component rerendered {updatedCount.current} times</p>
      </div>
    </div>
  );
}
```
