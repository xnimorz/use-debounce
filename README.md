# useDebounce react hook

It provides:

- [classic debounced callback](#debounced-callbacks)
- [**value** debouncing](#simple-values-debouncing)
- [cancel, maxWait and memoization](#advanced-usage)

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

## Simple values debouncing

According to https://twitter.com/dan_abramov/status/1060729512227467264

```javascript
import React, { useState } from 'react';
import { useDebounce } from 'use-debounce';

export default function Input() {
  const [text, setText] = useState('Hello');
  const [value] = useDebounce(text, 1000);

  return (
    <div>
      <input
        defaultValue={'Hello'}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
      <p>Actual value: {text}</p>
      <p>Debounce value: {value}</p>
    </div>
  );
}
```

This hook compares prev and next value using shallow equal. It means, setting an object `{}` will trigger debounce timer. If you have to compare objects (https://github.com/xnimorz/use-debounce/issues/27#issuecomment-496828063), you can use `useDebouncedCallback`, that is explained below:

## Debounced callbacks

Besides `useDebounce` for values you can debounce callbacks, that is the more commonly understood kind of debouncing.
Example with Input (and react callbacks): https://codesandbox.io/s/x0jvqrwyq

```js
import { useDebouncedCallback } from 'use-debounce';

function Input({ defaultValue }) {
  const [value, setValue] = useState(defaultValue);
  // Debounce callback
  const [debouncedCallback] = useDebouncedCallback(
    // function
    (value) => {
      setValue(value);
    },
    // delay in ms
    1000
  );

  // you should use `e => debouncedCallback(e.target.value)` as react works with synthetic evens
  return (
    <div>
      <input defaultValue={defaultValue} onChange={(e) => debouncedCallback(e.target.value)} />
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
  const [scrollHandler] = useDebouncedCallback(
    // function
    () => {
      setPosition(window.pageYOffset);
    },
    // delay in ms
    800
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

### Advanced usage

#### Cancel, maxWait and memoization

1. Both `useDebounce` and `useDebouncedCallback` works with `maxWait` option. This params describes the maximum time func is allowed to be delayed before it's invoked.
2. You can cancel debounce cycle, by calling `cancel` callback

The full example you can see here https://codesandbox.io/s/4wvmp1xlw4

```javascript
import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useDebouncedCallback } from 'use-debounce';

function Input({ defaultValue }) {
  const [value, setValue] = useState(defaultValue);
  const [debouncedFunction, cancel] = useDebouncedCallback(
    (value) => {
      setValue(value);
    },
    500,
    // The maximum time func is allowed to be delayed before it's invoked:
    { maxWait: 2000 }
  );

  // you should use `e => debouncedFunction(e.target.value)` as react works with synthetic evens
  return (
    <div>
      <input defaultValue={defaultValue} onChange={(e) => debouncedFunction(e.target.value)} />
      <p>Debounced value: {value}</p>
      <button onClick={cancel}>Cancel Debounce cycle</button>
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<Input defaultValue="Hello world" />, rootElement);
```

#### callPending method

`useDebouncedCallback` has `callPending` method. It allows to call the callback manually if it hasn't fired yet. This method is handy to use when the user takes an action that would cause the component to unmount, but you need to execute the callback.

```javascript
import React, { useState, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';

function InputWhichFetchesSomeData({ defaultValue, asyncFetchData }) {
  const [debouncedFunction, cancel, callPending] = useDebouncedCallback(
    (value) => {
      asyncFetchData;
    },
    500,
    { maxWait: 2000 }
  );

  // When the component goes to be unmounted, we will fetch data if the input has changed.
  useEffect(
    () => () => {
      callPending();
    },
    [callPending]
  );

  return <input defaultValue={defaultValue} onChange={(e) => debouncedFunction(e.target.value)} />;
}
```

#### leading calls

Both `useDebounce` and `useDebouncedCallback` work with the `leading` option. This param will execute the function once immediately when called. Subsequent calls will be debounced until the timeout expires.

For more information on how leading debounce calls work see: https://lodash.com/docs/#debounce

```javascript
import React, { useState } from 'react';
import { useDebounce } from 'use-debounce';

export default function Input() {
  const [text, setText] = useState('Hello');
  const [value] = useDebounce(text, 1000, { leading: true });

  // value is updated immediately when text changes the first time,
  // but all subsequent changes are debounced.
  return (
    <div>
      <input
        defaultValue={'Hello'}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
      <p>Actual value: {text}</p>
      <p>Debounce value: {value}</p>
    </div>
  );
}
```

#### Options:

You can provide additional options as a third argument to both `useDebounce` and `useDebouncedCallback`:

| option     | default                       | Description                                                                                                                      | Example                                                                |
| ---------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| maxWait    | -                             | Describes the maximum time func is allowed to be delayed before it's invoked                                                     | https://github.com/xnimorz/use-debounce#cancel-maxwait-and-memoization |
| leading    | -                             | This param will execute the function once immediately when called. Subsequent calls will be debounced until the timeout expires. | https://github.com/xnimorz/use-debounce#leading-calls                  |
| equalityFn | (prev, next) => prev === next | Comparator function which shows if timeout should be started                                                                     |                                                                        |
