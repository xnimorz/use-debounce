## 1.1.0

- add `callPending` callback to `useDebouncedCallback` method. It allows to call the callback manually if it hasn't fired yet. This method is handy to use when the user takes an action that would cause the component to unmount, but you need to execute the callback.

```javascript
import React, { useState, useCallback } from 'react';
import useDebouncedCallback from 'use-debounce/lib/callback';

function InputWhichFetchesSomeData({ defaultValue, asyncFetchData }) {
  const [debouncedFunction, cancel, callPending] = useDebouncedCallback(
    (value) => {
      asyncFetchData;
    },
    500,
    [],
    { maxWait: 2000 }
  );

  // When the component goes to be unmounted, we will fetch data if the input has changed.
  useEffect(
    () => () => {
      callPending();
    },
    []
  );

  return <input defaultValue={defaultValue} onChange={(e) => debouncedFunction(e.target.value)} />;
}
```

More examples are available here: https://github.com/xnimorz/use-debounce/commit/989d6c0efb4eef080ed78330233186d7b0c249e3#diff-c7e0cfdec8acc174d3301ff43b986264R196

## 1.0.0

The example with all features you can see here: https://codesandbox.io/s/4wvmp1xlw4

- add maxWait option. The maximum time func is allowed to be delayed before it's invoked:

```javascript
import { useDebounce, useDebouncedCallback } from 'use-debounce';

...
const debouncedValue = useDebounce(value, 300, {maxWait: 1000});
const debouncedCallback = useDebouncedCallback(() => {...}, 300, [], {maxWait: 1000});
```

- add cancel callback (thanks to [@thibaultboursier](https://github.com/thibaultboursier) for contributing). Cancel callback removes func from the queue (even maxWait):

```javascript
import { useDebounce, useDebouncedCallback } from 'use-debounce';

...
const [ debouncedValue, cancelValueDebouncingCycle ] = useDebounce(value, 1000);
const [ debouncedCallback, cancelCallback ] = useDebouncedCallback(() => {...}, 1000);
```

- [BREAKING] change the contact of use-debounce callback and value hooks:

**Old:**

```javascript
import { useDebounce, useDebouncedCallback } from 'use-debounce';

...
const debouncedValue = useDebounce(value, 1000);
const debouncedCallback = useDebouncedCallback(() => {...}, 1000);
```

**New:**

```javascript
import { useDebounce, useDebouncedCallback } from 'use-debounce';

...
const [ debouncedValue, cancelValueDebouncingCycle ] = useDebounce(value, 1000);
const [ debouncedCallback, cancelCallback ] = useDebouncedCallback(() => {...}, 1000);
```

You still can use only value and callback:

```javascript
import { useDebounce, useDebouncedCallback } from 'use-debounce';

...
const [ debouncedValue ] = useDebounce(value, 1000);
const [ debouncedCallback ] = useDebouncedCallback(() => {...}, 1000);
```

## 0.0.x

- add use-debounce callback and use-debounce value. First one is useful for debouncing callbacks e.g. event handlers, second one is handy for debouncing a value such as search fields etc.
