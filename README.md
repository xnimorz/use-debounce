# useDebounce react hook

Install it with yarn:

```
yarn add use-debounce
```

Or with npm:

```
npm i use-debounce --save
```

## Demo

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
